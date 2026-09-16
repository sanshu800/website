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
import { SCHEMA } from "../src/lib/db.ts";

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

/* The schema lives in `src/lib/db.ts` and is applied here rather than copied.
   It used to be duplicated, and drifted: a fresh install was missing the
   `events` table until the app happened to open the database first. */
db.exec(SCHEMA);

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

/* `org_name` is left out on purpose: the column default is the brand name, and
   spelling it here as well is how the two got out of step. */
const insert = db.prepare(
  `INSERT INTO users (id, email, name, role, password_hash, created_at)
   VALUES (?, ?, ?, ?, ?, ?)`,
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
