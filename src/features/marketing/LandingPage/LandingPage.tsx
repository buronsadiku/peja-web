import dynamic from "next/dynamic";
import { HeroSection } from "@/features/marketing/HeroSection";
import { LogoBar } from "@/features/marketing/LogoBar";

const HowItWorks = dynamic(() =>
  import("./HowItWorks").then((m) => ({
    default: m.HowItWorks,
  })),
);
const SampleSpread = dynamic(() =>
  import("@/features/marketing/SampleSpread").then((m) => ({
    default: m.SampleSpread,
  })),
);
const FeaturesGrid = dynamic(() =>
  import("@/features/marketing/FeaturesGrid").then((m) => ({
    default: m.FeaturesGrid,
  })),
);
const TestimonialSection = dynamic(() =>
  import("./TestimonialSection").then((m) => ({
    default: m.TestimonialSection,
  })),
);
const FAQSection = dynamic(() =>
  import("./FAQSection").then((m) => ({
    default: m.FAQSection,
  })),
);
const FinalCTA = dynamic(() =>
  import("./FinalCTA").then((m) => ({
    default: m.FinalCTA,
  })),
);

export const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <LogoBar />
      <HowItWorks />
      <SampleSpread />
      <FeaturesGrid />
      <TestimonialSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
};
