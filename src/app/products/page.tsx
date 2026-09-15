import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { products } from "@/lib/content/products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Intake, Engage, Deliver and Insight, on one Foundation memory layer — the four operational jobs a professional-services firm runs every day.",
  alternates: { canonical: "/products" },
};

const FIELD: Record<string, string> = {
  violet: "bg-violet",
  tangerine: "bg-tangerine",
  jade: "bg-jade",
  azure: "bg-azure",
  magenta: "bg-magenta",
};

export default function ProductsIndex() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Four jobs. One record. No seams."
        summary="Every professional-services firm runs the same four operations. Reygent gives each one a proper system, and puts all of them on a single memory layer so nothing is retyped between stages."
      />

      <section className="section bg-paper">
        <Container width="wide">
          <RevealGroup className="grid gap-5">
            {products.map((product, index) => (
              <RevealItem key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group grid gap-6 rounded-2xl border border-line p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md sm:p-8 lg:grid-cols-12 lg:items-center"
                >
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[0.6875rem] font-medium text-white",
                          FIELD[product.accent],
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                        {product.kicker}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-[1.5rem] tracking-[-0.02em] text-ink">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-micro text-violet">{product.headline}</p>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="text-body-lg text-fog">{product.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {product.flow.map((step) => (
                        <li
                          key={step.step}
                          className="rounded-full bg-mist px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                        >
                          {step.step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-2 lg:text-right">
                    <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-violet">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
