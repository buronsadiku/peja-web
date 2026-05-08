import { CtaSection } from "./components/CtaSection";
import { HeadlinersSection } from "./components/HeadlinersSection";
import { HeroSection } from "./components/HeroSection";
import { MemoriesSection } from "./components/MemoriesSection";
import { QuickInfoSection } from "./components/QuickInfoSection";
import { SponsorsSection } from "./components/SponsorsSection";

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <QuickInfoSection />
      <HeadlinersSection />
      <MemoriesSection />
      <SponsorsSection />
      <CtaSection />
    </>
  );
};
