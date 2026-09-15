import { getDb, all, one, run, newId } from "@/lib/db";

/**
 * Override store for site copy.
 *
 * Two tables. `content_overrides` holds the *current* value of any field an
 * editor has changed — one row per field, keyed `<doc>#<path>`, and the absence
 * of a row means "still the value shipped in code". `content_revisions` is an
 * append-only audit log, so every set, reset and revert is attributable and
 * reversible.
 *
 * Values are plain text. Nothing here is ever treated as markup, so an editor
 * cannot inject HTML into a page.
 */

export const MAX_LENGTH = { text: 240, prose: 4000, link: 300 } as const;

export type OverrideRow = {
  key: string;
  doc: string;
  path: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
};

export type RevisionRow = {
  id: string;
  key: string;
  doc: string;
  path: string;
  action: "set" | "reset" | "revert";
  old_value: string | null;
  new_value: string | null;
  actor: string | null;
  actor_email: string | null;
  at: string;
};

export type Actor = { id: string; name: string; email: string };

export function ensureContentSchema(): void {
  getDb().exec(`
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
}

/* ------------------------------------------------------------------ */
/* In-process cache                                                    */
/* ------------------------------------------------------------------ */

/**
 * Pages are rendered from the database, so every read of the override table is
 * on a hot path. The cache is versioned: any write in this process bumps the
 * version and the next read misses. The short TTL additionally picks up writes
 * from another process (a second node, or a `next build` alongside `next start`)
 * without an invalidation channel.
 */
let version = 0;
const TTL_MS = 2000;
let cache: { rows: OverrideRow[]; version: number; at: number } | null = null;

function bumpVersion(): void {
  version += 1;
  cache = null;
}

/** Rows for one document, with who last touched each field. */
export function overrideRowsFor(doc: string): OverrideRow[] {
  ensureContentSchema();
  return all<OverrideRow>(
    `SELECT key, doc, path, value, updated_at, updated_by FROM content_overrides WHERE doc = ?`,
    [doc],
  );
}

export function overridesFor(doc: string): Map<string, string> {
  return new Map(overrideRowsFor(doc).map((row) => [row.path, row.value]));
}

export function allOverrides(): OverrideRow[] {
  if (cache && cache.version === version && Date.now() - cache.at < TTL_MS) return cache.rows;
  ensureContentSchema();
  const rows = all<OverrideRow>(
    `SELECT key, doc, path, value, updated_at, updated_by FROM content_overrides ORDER BY updated_at DESC`,
  );
  cache = { rows, version, at: Date.now() };
  return rows;
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

export type WriteResult =
  | { ok: true; value: string | null; action: "set" | "reset" | "revert" }
  | { ok: false; reason: "missing" | "invalid" | "unchanged" };

function logRevision(row: {
  key: string;
  doc: string;
  path: string;
  action: "set" | "reset" | "revert";
  oldValue: string | null;
  newValue: string | null;
  actor: Actor;
}): void {
  run(
    `INSERT INTO content_revisions (id, key, doc, path, action, old_value, new_value, actor, actor_email, at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newId("rev"),
      row.key,
      row.doc,
      row.path,
      row.action,
      row.oldValue,
      row.newValue,
      row.actor.name,
      row.actor.email,
      new Date().toISOString(),
    ],
  );
}

/** Normalises editor input: trims, strips control characters, caps the length. */
export function normalise(input: string, kind: keyof typeof MAX_LENGTH = "text"): string | null {
  const cleaned = input.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  if (cleaned.length > MAX_LENGTH[kind]) return null;
  return cleaned;
}

export function setOverride(input: {
  doc: string;
  path: string;
  value: string;
  kind?: keyof typeof MAX_LENGTH;
  actor: Actor;
  /** The value the site would show without this override — used to log the change. */
  fallback?: string;
}): WriteResult {
  ensureContentSchema();
  const value = normalise(input.value, input.kind ?? "text");
  if (value === null) return { ok: false, reason: "invalid" };

  const key = `${input.doc}#${input.path}`;
  const existing = one<OverrideRow>(`SELECT * FROM content_overrides WHERE key = ?`, [key]);
  const oldValue = existing?.value ?? input.fallback ?? null;

  if (value === oldValue) return { ok: false, reason: "unchanged" };

  const now = new Date().toISOString();
  if (value === (input.fallback ?? "")) {
    // Typing the shipped value back in should clear the override, not store a
    // copy of it — otherwise every field the editor touches would freeze.
    run(`DELETE FROM content_overrides WHERE key = ?`, [key]);
  } else {
    run(
      `INSERT INTO content_overrides (key, doc, path, value, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value,
                                     updated_at = excluded.updated_at,
                                     updated_by = excluded.updated_by`,
      [key, input.doc, input.path, value, now, input.actor.email],
    );
  }

  logRevision({
    key,
    doc: input.doc,
    path: input.path,
    action: "set",
    oldValue,
    newValue: value === (input.fallback ?? "") ? null : value,
    actor: input.actor,
  });
  bumpVersion();
  return { ok: true, value, action: "set" };
}

export function resetOverride(input: { doc: string; path: string; actor: Actor }): WriteResult {
  ensureContentSchema();
  const key = `${input.doc}#${input.path}`;
  const existing = one<OverrideRow>(`SELECT * FROM content_overrides WHERE key = ?`, [key]);
  if (!existing) return { ok: false, reason: "missing" };

  run(`DELETE FROM content_overrides WHERE key = ?`, [key]);
  logRevision({
    key,
    doc: input.doc,
    path: input.path,
    action: "reset",
    oldValue: existing.value,
    newValue: null,
    actor: input.actor,
  });
  bumpVersion();
  return { ok: true, value: null, action: "reset" };
}

export function revertRevision(input: { id: string; actor: Actor }): WriteResult {
  ensureContentSchema();
  const revision = one<RevisionRow>(`SELECT * FROM content_revisions WHERE id = ?`, [input.id]);
  if (!revision) return { ok: false, reason: "missing" };

  const now = new Date().toISOString();
  if (revision.old_value === null || revision.old_value === "") {
    // There was no previous override — reverting means going back to the copy
    // that ships in code.
    run(`DELETE FROM content_overrides WHERE key = ?`, [revision.key]);
    logRevision({
      key: revision.key,
      doc: revision.doc,
      path: revision.path,
      action: "revert",
      oldValue: revision.new_value,
      newValue: null,
      actor: input.actor,
    });
    bumpVersion();
    return { ok: true, value: null, action: "revert" };
  }

  run(
    `INSERT INTO content_overrides (key, doc, path, value, updated_at, updated_by)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value,
                                   updated_at = excluded.updated_at,
                                   updated_by = excluded.updated_by`,
    [revision.key, revision.doc, revision.path, revision.old_value, now, input.actor.email],
  );
  logRevision({
    key: revision.key,
    doc: revision.doc,
    path: revision.path,
    action: "revert",
    oldValue: revision.new_value,
    newValue: revision.old_value,
    actor: input.actor,
  });
  bumpVersion();
  return { ok: true, value: revision.old_value, action: "revert" };
}

export function deleteOverrideByKey(key: string, actor: Actor): boolean {
  ensureContentSchema();
  const existing = one<OverrideRow>(`SELECT * FROM content_overrides WHERE key = ?`, [key]);
  if (!existing) return false;
  run(`DELETE FROM content_overrides WHERE key = ?`, [key]);
  logRevision({
    key,
    doc: existing.doc,
    path: existing.path,
    action: "reset",
    oldValue: existing.value,
    newValue: null,
    actor,
  });
  bumpVersion();
  return true;
}

/* ------------------------------------------------------------------ */
/* Reads for the admin                                                 */
/* ------------------------------------------------------------------ */

export function recentRevisions(limit = 40, doc?: string): RevisionRow[] {
  ensureContentSchema();
  return doc
    ? all<RevisionRow>(
        `SELECT * FROM content_revisions WHERE doc = ? ORDER BY at DESC LIMIT ?`,
        [doc, limit],
      )
    : all<RevisionRow>(`SELECT * FROM content_revisions ORDER BY at DESC LIMIT ?`, [limit]);
}

export function revisionsForKey(key: string, limit = 12): RevisionRow[] {
  ensureContentSchema();
  return all<RevisionRow>(`SELECT * FROM content_revisions WHERE key = ? ORDER BY at DESC LIMIT ?`, [
    key,
    limit,
  ]);
}

export function overrideStats(): {
  total: number;
  byDoc: Record<string, number>;
  lastEdit: { at: string; by: string | null } | null;
} {
  const rows = allOverrides();
  const byDoc: Record<string, number> = {};
  for (const row of rows) byDoc[row.doc] = (byDoc[row.doc] ?? 0) + 1;
  const last = rows[0];
  return {
    total: rows.length,
    byDoc,
    lastEdit: last ? { at: last.updated_at, by: last.updated_by } : null,
  };
}

export function contentVersionCount(): number {
  return one<{ n: number }>(`SELECT COUNT(*) AS n FROM content_revisions`)?.n ?? 0;
}
