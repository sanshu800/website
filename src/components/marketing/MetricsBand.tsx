import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getShared } from "@/lib/cms/content";

/**
 * Capability band.
 *
 * These are counts of what the platform does — modules, integration surfaces,
 * migrations required — not performance claims about customers. Nothing here
 * needs a customer reference to be true.
 */
export function MetricsBand() {
  const { platformFacts } = getShared();

  return (
    <section className="border-y border-line bg-paper py-14 sm:py-16">
      <Container width="wide">
        <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {platformFacts.map((fact) => (
            <RevealItem key={fact.label} className="lg:border-l lg:border-line lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <p className="font-display text-[2.25rem] leading-none tracking-[-0.03em] text-ink">
                {fact.value}
              </p>
              <p className="mt-3 text-[0.9375rem] font-medium text-ink">{fact.label}</p>
              <p className="mt-1 text-micro text-fog">{fact.detail}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
