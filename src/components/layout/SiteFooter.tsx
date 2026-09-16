import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ReygentMark } from "@/components/brand/Logo";
import type { ChromeDoc } from "@/lib/content/pages/chrome";

export function SiteFooter({
  brand,
  footer,
}: {
  brand: ChromeDoc["brand"];
  footer: ChromeDoc["footer"];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-night text-on-night">
      <Container width="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          {/* Three columns for the brand block, nine for the five nav columns:
              at four-and-eight the longest service label ("Remove the manual
              admin") wrapped to a second line, which broke the rhythm of that
              column against its neighbours. */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <ReygentMark className="h-7 w-7" />
              <span className="font-display text-body-lg font-semibold tracking-[-0.02em] text-on-night">
                {brand.name}
              </span>
            </Link>
            <p className="mt-5 max-w-[20rem] text-small text-on-night-2">
              {brand.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={footer.actions.primary.href}
                className="inline-flex h-9 items-center rounded-lg bg-paper px-4 text-micro font-medium text-ink transition-colors pointer-coarse:min-h-11 hover:bg-mist-2"
              >
                {footer.actions.primary.label}
              </Link>
              <Link
                href={footer.actions.secondary.href}
                className="inline-flex h-9 items-center rounded-lg border border-white/20 px-4 text-micro font-medium text-on-night transition-colors pointer-coarse:min-h-11 hover:border-white/40"
              >
                {footer.actions.secondary.label}
              </Link>
            </div>
            <a
              href={`mailto:${brand.email}`}
              className="mt-6 inline-block font-mono text-label text-on-night-2 transition-colors hover:text-on-night"
            >
              {brand.email}
            </a>
          </div>

          <div /*
               * Five equal columns gave each one about 127px at the 1024px
               * breakpoint, and the longest label needs roughly 150 — which is
               * why "Remove the manual admin" broke onto a second line. The
               * Services column is the one whose labels are phrases rather than
               * nouns, so it gets the extra width instead of every column being
               * sized for the worst case.
               */
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-x-5">
            {footer.columns.map((column: ChromeDoc["footer"]["columns"][number]) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="font-mono text-eyebrow uppercase text-on-night-2">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.items.map((item: { label: string; href: string }) => (
                    <li key={`${column.title}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="text-small text-on-night-2 transition-colors duration-200 hover:text-on-night"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-label text-on-night-2">
            © {year} {brand.name}. {brand.copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-mono text-label text-on-night-2">
              {footer.builtFor}
            </span>
            {Object.values(footer.legalLinks).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-label text-on-night-2 transition-colors hover:text-on-night"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/*
          Placeholder disclosure. Client names and testimonials on this build are
          invented. Remove this line once real references are published.
        */}
        <p className="border-t border-white/10 py-6 text-eyebrow leading-relaxed text-on-night-3">
          {footer.disclosure}
        </p>
      </Container>
    </footer>
  );
}
