import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/marketing/Hero";
import { getProducts } from "@/lib/cms/content";
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

// Rendered per request so the hero film can resolve against the current contents
// of `public/video/` — dropping a file in there swaps the hero without a rebuild.
// The homepage reads no database, so dynamic rendering costs nothing meaningful.
export const dynamic = "force-dynamic";

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
      <ProductTabs products={[...getProducts().modules, getProducts().foundation]} />
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
