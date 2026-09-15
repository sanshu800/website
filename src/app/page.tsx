import type { Metadata } from "next";
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

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
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
