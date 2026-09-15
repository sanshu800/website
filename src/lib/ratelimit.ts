/**
 * Abuse control for the public write endpoints.
 *
 * Two cheap layers, because these endpoints take anonymous posts from the open
 * internet and one of them collects budget and revenue bands:
 *
 *   1. a sliding-window limiter keyed on the caller's address, and
 *   2. a honeypot field, checked before anything is parsed.
 *
 * **Scope, stated honestly:** the limiter's state lives in the Node process, so
 * it protects one instance. A deployment running several instances behind a
 * load balancer needs a shared counter (Redis, or the SQLite file that is
 * already in this project) — this is deliberate 80% coverage, not a claim of
 * distributed protection.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Above this, expired entries are swept so a botnet cannot grow the map forever. */
const MAX_TRACKED_KEYS = 5_000;

/**
 * Best-effort caller identity. Proxies set `x-forwarded-for` with the client
 * first; `x-real-ip` covers nginx. Falls back to a shared key, which degrades
 * to a global limit rather than to no limit.
 */
export function callerKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `${scope}:${address}`;
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets — sent as `Retry-After`. */
  retryAfterSeconds: number;
  remaining: number;
};

export function rateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [entryKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(entryKey);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0, remaining: limit - 1 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      remaining: 0,
    };
  }

  return { ok: true, retryAfterSeconds: 0, remaining: limit - bucket.count };
}

/**
 * Honeypot: a field that is present in the markup but hidden from people. A
 * filled honeypot is treated as spam — the caller gets the same success
 * response a real visitor would, so a bot learns nothing from the reply.
 *
 * Named `company_website` rather than something like `email`, because browser
 * autofill happily completes plausible-looking fields and would otherwise
 * reject real people.
 */
export function isHoneypotFilled(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false;
  const value = (payload as Record<string, unknown>).company_website;
  if (typeof value === "string" && value.trim().length > 0) return true;
  // `/api/submissions` wraps the form body in `payload`, so look there too.
  const nested = (payload as Record<string, unknown>).payload;
  return typeof nested === "object" && nested !== null && isHoneypotFilled(nested);
}

/** The friendly refusal. Deliberately human, and it tells the person what to do. */
export function tooManyRequests(result: RateLimitResult) {
  return Response.json(
    {
      error:
        "That is a few messages in a row from this connection. Give it an hour, or email hello@reygent.ai and we will pick it up there.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    },
  );
}
