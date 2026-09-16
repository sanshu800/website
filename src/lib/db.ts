import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Persistence.
 *
 * Node's built-in SQLite (`node:sqlite`) — a real, durable, queryable database
 * with zero dependencies and no native build step. One file on disk, real SQL,
 * real transactions. Three tables:
 *
 *   users        admin accounts (created by `npm run admin:create`, never by a
 *                public form), scrypt-hashed passwords
 *   sessions     opaque session tokens, stored as SHA-256 hashes
 *   submissions  every inbound marketing form, one table with a `kind`
 *                discriminator
 *   events       first-party measurement: page views, form starts, completed
 *                enquiries and caught exceptions. No cookies, no third party, no
 *                IP addresses — see `src/lib/events.ts` for what is and is not
 *                stored, and why.
 *
 * Site copy lives in two further tables created by `src/lib/cms/store.ts`.
 *
 * The database lives at DATA_DIR (default `<repo>/data`). It is created and
 * migrated on first use, so a fresh clone works after `npm install`.
 */

const DATA_DIR = process.env.REYGENT_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.REYGENT_DB_PATH ?? path.join(DATA_DIR, "reygent.db");

let db: DatabaseSync | null = null;

/*
 * Exported because the CLI scripts (`scripts/seed.ts`, `scripts/admin.ts`)
 * apply it directly. They used to keep private copies, which drifted — a fresh
 * install was missing the `events` table until the app opened the database, and
 * the brand name in `users.org_name` was wrong in one copy and not the other.
 */
export const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'owner',
  org_name      TEXT NOT NULL DEFAULT 'Reygent AI',
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

CREATE TABLE IF NOT EXISTS events (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  path       TEXT,
  detail     TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(name, created_at);

CREATE TABLE IF NOT EXISTS submissions (
  id               TEXT PRIMARY KEY,
  kind             TEXT NOT NULL,
  name             TEXT,
  email            TEXT,
  company          TEXT,
  payload          TEXT NOT NULL,
  created_at       TEXT NOT NULL,
  crm_status       TEXT,
  crm_attempted_at TEXT,
  crm_error        TEXT
);
`;

/*
 * `CREATE TABLE IF NOT EXISTS` gets a fresh install to the current shape and
 * does nothing at all for a database that already exists, so every column added
 * after the first release is listed here and applied once. Without this, a
 * deployment whose database predates the column keeps working until the first
 * query that names it, and then fails in production.
 */
const ADDED_COLUMNS: Array<[table: string, column: string, definition: string]> = [
  ["submissions", "crm_status", "TEXT"],
  ["submissions", "crm_attempted_at", "TEXT"],
  ["submissions", "crm_error", "TEXT"],
];

/** Adds any missing column. Idempotent, so it is safe on every boot. */
function migrate(database: DatabaseSync): void {
  for (const [table, column, definition] of ADDED_COLUMNS) {
    const existing = database.prepare(`PRAGMA table_info(${table})`).all() as Array<{
      name: string;
    }>;
    if (!existing.some((row) => row.name === column)) {
      database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  }
}

/** Opens (and migrates) the database. Safe to call from any server context. */
export function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(SCHEMA);
  migrate(db);
  return db;
}

/* ------------------------------------------------------------------ */
/* Query helpers                                                      */
/* ------------------------------------------------------------------ */

export function all<T>(sql: string, params: unknown[] = []): T[] {
  return getDb().prepare(sql).all(...(params as never[])) as T[];
}

export function one<T>(sql: string, params: unknown[] = []): T | null {
  const row = getDb().prepare(sql).get(...(params as never[]));
  return (row as T | undefined) ?? null;
}

export function run(sql: string, params: unknown[] = []) {
  return getDb().prepare(sql).run(...(params as never[]));
}

export function count(sql: string, params: unknown[] = []): number {
  const row = one<{ n: number }>(sql, params);
  return row?.n ?? 0;
}

/** Stable, short, sortable-enough identifier for seeded + user rows. */
export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export const dbPath = DB_PATH;
