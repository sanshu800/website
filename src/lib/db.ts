import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Persistence.
 *
 * Node's built-in SQLite (`node:sqlite`) — a real, durable, queryable database
 * with zero dependencies and no native build step. One file on disk, real SQL,
 * real transactions. Tables:
 *
 *   users         admin accounts (created by `npm run admin:create`, never by a
 *                 public form), scrypt-hashed passwords
 *   sessions      opaque session tokens, stored as SHA-256 hashes
 *   submissions   every inbound marketing form, one table with a `kind`
 *                 discriminator
 *   events        first-party measurement: page views, form starts, completed
 *                 enquiries and caught exceptions. No cookies, no third party, no
 *                 IP addresses — see `src/lib/events.ts` for what is and is not
 *                 stored, and why.
 *   content_*     site copy overrides and their revision log (see `cms/store.ts`)
 *
 * The database lives at DATA_DIR (default `<repo>/data`). It is created and
 * migrated on first use, so a fresh clone works after `npm install`.
 *
 * ## Why this file is careful about locks
 *
 * A deploy runs `next build`, which renders pages in several worker processes,
 * while the app it is replacing — or a `next start` on the same machine, or a
 * seed script — may still be holding a write. Every one of those processes opens
 * this database, and the first version of this file opened it by running the
 * whole schema, which meant:
 *
 *   - `PRAGMA journal_mode = WAL` on **every** connection. Changing the journal
 *     mode needs an exclusive lock, and SQLite deliberately does **not** apply
 *     `busy_timeout` to that particular pragma — it returns SQLITE_BUSY (5)
 *     immediately. So the first time two processes overlapped, the loser failed
 *     with `database is locked`, in 0ms, at whatever page happened to be
 *     rendering. Reproduced here on demand; it is not a rare race.
 *   - The rest of the schema on every connection too. `CREATE TABLE IF NOT
 *     EXISTS` is free once the table exists, but it does need a write lock on a
 *     fresh database — which is exactly when several workers start at once.
 *
 * The fix has four parts, and all four matter:
 *
 *   1. **`busy_timeout` first, on every connection.** Contention now waits
 *      instead of failing.
 *   2. **The journal mode is set once, during initialisation.** It is a
 *      persistent property of the file, not of the connection, so re-asserting
 *      it per connection was never buying anything — it was only ever a failure
 *      point.
 *   3. **Schema work is version-gated.** `PRAGMA user_version` records the shape
 *      of the database; when it matches, opening a connection performs no writes
 *      at all. Under WAL that makes a build's connections pure readers, which
 *      never block and are never blocked.
 *   4. **Initialisation retries.** On a genuinely fresh database every worker
 *      sees version 0 and races; the losers wait, re-read the version, and find
 *      the winner's work already done.
 */

const DATA_DIR = process.env.REYGENT_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.REYGENT_DB_PATH ?? path.join(DATA_DIR, "reygent.db");

/**
 * How long a connection waits for a lock before giving up, in milliseconds.
 *
 * SQLite's default is 0, which fails instantly — the setting which turned a
 * momentary overlap into a deploy-stopping error. Five seconds is far longer
 * than any write this application performs and short enough that a genuinely
 * stuck database still surfaces as an error rather than a hang.
 */
const BUSY_TIMEOUT_MS = Number(process.env.REYGENT_DB_TIMEOUT_MS ?? 5000);

/**
 * The shape of the database. Bump this whenever `SCHEMA` or `CONTENT_SCHEMA`
 * changes, or a column is added to `ADDED_COLUMNS` — an existing database whose
 * version is behind runs the whole initialisation once, which is idempotent.
 */
const SCHEMA_VERSION = 1;

/** Initialisation attempts before giving up on a cold-start race. */
const INIT_ATTEMPTS = 8;

let db: DatabaseSync | null = null;

/*
 * Exported because the CLI scripts (`scripts/seed.ts`, `scripts/admin.ts`)
 * apply it. They used to keep private copies, which drifted — a fresh install
 * was missing the `events` table until the app opened the database, and the
 * brand name in `users.org_name` was wrong in one copy and not the other.
 *
 * No `PRAGMA` statements live in here: a pragma set per connection belongs on
 * the connection, and one that persists in the file belongs in
 * `initialiseDatabase`. Mixing the two is what caused the lock.
 */
export const SCHEMA = `
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
 * The copy overrides and their revision log. These used to be created by
 * `ensureContentSchema()` in `cms/store.ts`, which was called from every read
 * helper — so rendering a page ran DDL, on a read. The statements are unchanged;
 * only the place they run has moved, and now they run once.
 */
export const CONTENT_SCHEMA = `
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

/** The stored shape of the database. `0` means "never initialised". */
function schemaVersion(database: DatabaseSync): number {
  const row = database.prepare("PRAGMA user_version").get() as { user_version: number };
  return row.user_version;
}

/**
 * Everything that writes to the schema, in one place, in the right order.
 *
 * Exported so the CLI scripts run exactly this rather than their own copy — the
 * duplication is what produced the earlier drift, and a second copy of "how to
 * open this database" is exactly the kind of thing that goes stale quietly.
 */
export function initialiseDatabase(database: DatabaseSync): void {
  database.exec("PRAGMA journal_mode = WAL;");
  database.exec(SCHEMA);
  database.exec(CONTENT_SCHEMA);
  migrate(database);
  database.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}

/** Blocking sleep — `getDb` is synchronous, so this has to be too. */
function sleep(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/** Did this failure come from another process holding a lock? */
function isContention(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /database is locked|database is busy|database table is locked/i.test(message);
}

function openDatabase(): DatabaseSync {
  try {
    mkdirSync(path.dirname(DB_PATH), { recursive: true });
  } catch (error) {
    throw new Error(
      `Cannot create the database directory ${path.dirname(DB_PATH)}. ` +
        `A SQLite deployment needs a writable, persistent directory — on a read-only ` +
        `filesystem (a serverless function's bundle, for example) set REYGENT_DATA_DIR to a ` +
        `mounted volume, or move to a networked database.`,
      { cause: error },
    );
  }

  let database: DatabaseSync;
  try {
    database = new DatabaseSync(DB_PATH);
  } catch (error) {
    throw new Error(
      `Cannot open the database at ${DB_PATH}. If the directory is read-only, set ` +
        `REYGENT_DATA_DIR to a writable path.`,
      { cause: error },
    );
  }

  /*
   * First statement on every connection, and deliberately so: `busy_timeout` is
   * per-connection state and only helps if it is set before anything can
   * contend. `foreign_keys` is per-connection too — it is not stored in the
   * file, so it has to be re-stated here.
   */
  database.exec(`PRAGMA busy_timeout = ${BUSY_TIMEOUT_MS}; PRAGMA foreign_keys = ON;`);
  return database;
}

/** Opens (and, when needed, initialises) the database. Safe from any context. */
export function getDb(): DatabaseSync {
  if (db) return db;

  const database = openDatabase();

  for (let attempt = 0; schemaVersion(database) < SCHEMA_VERSION; attempt++) {
    try {
      initialiseDatabase(database);
      break;
    } catch (error) {
      /*
       * Another process may have finished the same work while we waited, so the
       * version is re-read on the way round rather than assumed. A cold start
       * with several workers is the normal case here, not an exotic one.
       */
      if (!isContention(error) || attempt >= INIT_ATTEMPTS - 1) {
        database.close();
        throw error;
      }
      sleep(60 * (attempt + 1));
    }
  }

  db = database;
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
