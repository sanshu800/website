import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ReygentMark } from "@/components/brand/Logo";
import { footerNav, site } from "@/lib/content/marketing";

const COLUMNS = [
  { title: "Product", items: footerNav.product },
  { title: "Solutions", items: footerNav.solutions },
  { title: "Compare", items: footerNav.compare },
  { title: "Resources", items: footerNav.resources },
  { title: "Company", items: footerNav.company },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink text-on-ink">
      <Container width="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <ReygentMark className="h-7 w-7" />
              <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-on-ink">
                Reygent
              </span>
            </Link>
            <p className="mt-5 max-w-[20rem] text-small text-on-ink-2">
              {site.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/get-started"
                className="inline-flex h-9 items-center rounded-lg bg-paper px-4 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-mist-2"
              >
                Start free trial
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-9 items-center rounded-lg border border-white/20 px-4 text-[0.8125rem] font-medium text-on-ink transition-colors hover:border-white/40"
              >
                Book a demo
              </Link>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block font-mono text-[0.75rem] text-on-ink-2 transition-colors hover:text-on-ink"
            >
              {site.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="font-mono text-eyebrow uppercase text-on-ink-2">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.items.map((item) => (
                    <li key={`${column.title}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="text-small text-on-ink-2 transition-colors duration-200 hover:text-on-ink"
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
          <p className="font-mono text-[0.75rem] text-on-ink-2">
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-mono text-[0.75rem] text-on-ink-2">
              Built for professional-service firms
            </span>
            <Link
              href="/legal/privacy"
              className="font-mono text-[0.75rem] text-on-ink-2 transition-colors hover:text-on-ink"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="font-mono text-[0.75rem] text-on-ink-2 transition-colors hover:text-on-ink"
            >
              Terms
            </Link>
            <Link
              href="/security"
              className="font-mono text-[0.75rem] text-on-ink-2 transition-colors hover:text-on-ink"
            >
              Security
            </Link>
          </div>
        </div>

        {/*
          Placeholder disclosure. Client names and testimonials on this build are
          invented. Remove this line once real references are published.
        */}
        <p className="border-t border-white/10 py-6 text-[0.6875rem] leading-relaxed text-on-ink-2/70">
          Client names, marks and testimonials shown on this site are placeholders
          shaped to our target market and do not represent real customers. Replace
          before publishing.
        </p>
      </Container>
    </footer>
  );
}
