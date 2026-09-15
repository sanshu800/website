/* eslint-disable no-console */
/**
 * Creates the local development database and two admin accounts.
 *
 *   npm run seed       # create data/reygent.db if it does not exist
 *   npm run db:reset   # wipe and start again
 *
 * For a real deployment, do not run this: create your own account with
 * `npm run admin:create` and leave the demo logins out of the database.
 */
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.REYGENT_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.REYGENT_DB_PATH ?? path.join(DATA_DIR, "reygent.db");
const reset = process.argv.includes("--reset");

if (reset) {
  for (const suffix of ["", "-wal", "-shm"]) {
    try {
      rmSync(`${DB_PATH}${suffix}`);
    } catch {
      /* not present — nothing to remove */
    }
  }
}

mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'owner',
    org_name      TEXT NOT NULL DEFAULT 'Reygent',
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    user_agent TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

  CREATE TABLE IF NOT EXISTS submissions (
    id         TEXT PRIMARY KEY,
    kind       TEXT NOT NULL,
    name       TEXT,
    email      TEXT,
    company    TEXT,
    payload    TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS content_overrides (
    key        TEXT PRIMARY KEY,
    doc        TEXT NOT NULL,
    path       TEXT NOT NULL,
    value      TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    updated_by TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_content_overrides_doc ON content_overrides(doc);

  CREATE TABLE IF NOT EXISTS content_revisions (
    id          TEXT PRIMARY KEY,
    key         TEXT NOT NULL,
    doc         TEXT NOT NULL,
    path        TEXT NOT NULL,
    action      TEXT NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    actor       TEXT,
    actor_email TEXT,
    at          TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_content_revisions_key ON content_revisions(key);
  CREATE INDEX IF NOT EXISTS idx_content_revisions_at ON content_revisions(at);
`);

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

const existing = db.prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number };

if (existing.n > 0) {
  console.log(`${existing.n} account(s) already exist. Use npm run db:reset to rebuild.`);
  process.exit(0);
}

const now = new Date().toISOString();
const accounts = [
  { id: "usr_owner", email: "demo@reygent.ai", name: "Alex Morgan", role: "owner" },
  { id: "usr_admin", email: "ops@reygent.ai", name: "Priya Raman", role: "admin" },
];

const insert = db.prepare(
  `INSERT INTO users (id, email, name, role, org_name, password_hash, created_at)
   VALUES (?, ?, ?, ?, 'Reygent', ?, ?)`,
);

for (const account of accounts) {
  insert.run(
    account.id,
    account.email,
    account.name,
    account.role,
    hashPassword("demo1234"),
    now,
  );
}

console.log(`Seeded ${DB_PATH}`);
console.log(`  ${accounts.length} admin accounts`);
for (const account of accounts) {
  console.log(`  ${account.role.padEnd(5)}  ${account.email}  /  demo1234`);
}
console.log("\nAdmin:  http://localhost:3000/admin");
console.log("Change these credentials with `npm run admin:create` before deploying.");
