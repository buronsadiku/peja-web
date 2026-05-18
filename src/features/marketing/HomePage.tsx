import { Suspense } from "react";
import { CtaSection } from "./components/CtaSection";
import { HeroSection } from "./components/HeroSection";
import { LineupSection } from "./components/LineupSection";
import { MemoriesSection } from "./components/MemoriesSection";
import { MemoriesSectionSkeleton } from "./components/MemoriesSectionSkeleton";
import { QuickInfoSection } from "./components/QuickInfoSection";
import { SponsorsSection } from "./components/SponsorsSection";

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <QuickInfoSection />
      <Suspense fallback={null}>
        <LineupSection />
      </Suspense>
      <Suspense fallback={<MemoriesSectionSkeleton />}>
        <MemoriesSection />
      </Suspense>
      <SponsorsSection />
      <CtaSection />
    </>
  );
};
