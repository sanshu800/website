import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Persistence.
 *
 * Node's built-in SQLite (`node:sqlite`) — a real, durable, queryable database
 * with zero dependencies and no native build step. One file on disk, real SQL,
 * real transactions. If this app later needs Postgres, `src/lib/db/queries.ts`
 * is the only file that has to change.
 *
 * The database lives at DATA_DIR (default `<repo>/data`). It is created and
 * migrated on first use, so a fresh clone works after `npm install`.
 */

const DATA_DIR = process.env.REYGENT_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.REYGENT_DB_PATH ?? path.join(DATA_DIR, "reygent.db");

let db: DatabaseSync | null = null;

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

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

CREATE TABLE IF NOT EXISTS companies (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  domain      TEXT NOT NULL,
  sector      TEXT NOT NULL,
  size        TEXT NOT NULL,
  city        TEXT NOT NULL,
  country     TEXT NOT NULL,
  stage       TEXT NOT NULL,
  health      TEXT NOT NULL,
  arr         INTEGER NOT NULL DEFAULT 0,
  owner       TEXT NOT NULL,
  website_intent INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  last_touch  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id         TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  title      TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  linkedin   TEXT,
  seniority  TEXT NOT NULL,
  status     TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);

CREATE TABLE IF NOT EXISTS engagements (
  id          TEXT PRIMARY KEY,
  company_id  TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  value       INTEGER NOT NULL,
  stage       TEXT NOT NULL,
  probability INTEGER NOT NULL,
  owner       TEXT NOT NULL,
  close_date  TEXT NOT NULL,
  source      TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_engagements_company ON engagements(company_id);

CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,
  company_id  TEXT REFERENCES companies(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  kind        TEXT NOT NULL,
  priority    TEXT NOT NULL,
  status      TEXT NOT NULL,
  assignee    TEXT NOT NULL,
  due_at      TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id         TEXT PRIMARY KEY,
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,
  summary    TEXT NOT NULL,
  actor      TEXT NOT NULL,
  source     TEXT NOT NULL,
  at         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_activities_company ON activities(company_id);

CREATE TABLE IF NOT EXISTS submissions (
  id         TEXT PRIMARY KEY,
  kind       TEXT NOT NULL,
  name       TEXT,
  email      TEXT,
  company    TEXT,
  payload    TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

/** Opens (and migrates) the database. Safe to call from any server context. */
export function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(SCHEMA);
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
