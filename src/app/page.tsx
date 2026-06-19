import { LandingNav } from "@/features/landing/components/LandingNav";
import { Hero } from "@/features/landing/components/Hero";
import { WorkflowSteps } from "@/features/landing/components/WorkflowSteps";
import { InsightsDashboard } from "@/features/landing/components/InsightsDashboard";
import { CTASection } from "@/features/landing/components/CTASection";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingNav />
      <main className="landing-main">
        <Hero />
        <WorkflowSteps />
        <InsightsDashboard />
        <FeaturesGrid />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}