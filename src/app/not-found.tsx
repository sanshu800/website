import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ReygentMark } from "@/components/brand/Logo";

export const metadata = { title: "Page not found" };

const DESTINATIONS = [
  { href: "/products", label: "Products", detail: "The four modules and the Foundation layer" },
  { href: "/pricing", label: "Pricing", detail: "Core, Pro and Enterprise, with every limit" },
  { href: "/product-tour", label: "Product tour", detail: "Ten minutes, five stops, no sales call" },
  { href: "/blog", label: "Blog", detail: "Operations writing from live implementations" },
  { href: "/contact", label: "Contact", detail: "A person replies to every message" },
  { href: "/login", label: "Sign in", detail: "Demo account: demo@reygent.ai / demo1234" },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pb-20 pt-32 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(91,52,242,0.09),transparent_70%)]"
      />
      <Container width="wide" className="relative">
        <div className="flex items-center gap-3">
          <ReygentMark className="h-6 w-6 text-violet" />
          <p className="font-mono text-eyebrow uppercase text-fog-2">Error 404</p>
        </div>

        <h1 className="mt-8 max-w-[36rem] text-display-xl text-ink">
          That page is not on the record.
        </h1>
        <p className="mt-5 max-w-[40rem] text-lead text-fog">
          The link may be old, or the page may have moved. Nothing was lost — every route
          that existed is still reachable from the destinations below.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-violet px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet-2"
          >
            Back to the homepage <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-full border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
          >
            Report a broken link
          </Link>
        </div>

        <ul className="mt-14 grid gap-x-10 gap-y-6 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <li key={destination.href}>
              <Link href={destination.href} className="group flex items-start gap-3">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-violet transition-transform duration-300 group-hover:translate-x-0.5" />
                <span>
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {destination.label}
                  </span>
                  <span className="mt-1 block text-[0.75rem] text-fog">
                    {destination.detail}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
