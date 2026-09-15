import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/marketing/Hero";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { ProductTabs } from "@/components/marketing/ProductTabs";
import { ModulesStrip } from "@/components/marketing/ModulesStrip";
import { FoundationSection } from "@/components/marketing/FoundationSection";
import { MetricsBand } from "@/components/marketing/MetricsBand";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { TestimonialWall } from "@/components/marketing/TestimonialWall";
import { IndustryGrid } from "@/components/marketing/IndustryGrid";
import { IntegrationsStrip } from "@/components/marketing/IntegrationsStrip";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { LogoMarquee } from "@/components/marketing/LogoMarquee";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Proof band immediately after the film — quiet, light, one line. */}
      <section className="border-b border-line bg-paper py-14 sm:py-16">
        <Container width="wide">
          <LogoMarquee label="Operations teams at firms like these" />
          <p className="mt-6 text-center font-mono text-[0.6875rem] text-fog-2">
            Placeholder client marks — invented for design purposes.
          </p>
        </Container>
      </section>

      <ModulesStrip />
      <ProblemSection />
      <ProductTabs />
      <FoundationSection />
      <MetricsBand />
      <HowItWorksSection />
      <TestimonialWall />
      <IndustryGrid />
      <IntegrationsStrip />
      <PricingPreview />
      <FinalCTA />
    </>
  );
}
