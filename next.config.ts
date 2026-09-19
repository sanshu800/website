import type { NextConfig } from "next";

/**
 * Response policy.
 *
 * Two jobs: put a baseline of browser-security headers on every response, and
 * stop `public/` assets being served with `max-age=0` (Next's default), which
 * made every returning visitor re-download photographs that never change.
 *
 * The CSP is deliberately narrow. It locks down framing, form targets and
 * plugin/base-URI injection — the parts a static policy can hold without
 * knowing which scripts Next injects — and leaves script-src alone. Adding
 * `script-src` needs nonces threaded through the app and a browser to verify
 * against, so it stays out until it can be tested for real.
 */
const SECURITY_CONTEXT = [
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: SECURITY_CONTEXT },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Only honoured over HTTPS, so it is a no-op locally and in the sandbox.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The persistence layer is Node's built-in SQLite; keep it out of the bundler.
  serverExternalPackages: [],
  images: {
    // AVIF first: the photographs are large PNG sources, and AVIF typically
    // halves what WebP already saved.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Build-time imagery: safe to cache hard, since the filename changes
        // when the picture does.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The hero film and uploaded media can be replaced under the same
        // filename, so they get a long-but-revalidating window instead.
        source: "/video/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
