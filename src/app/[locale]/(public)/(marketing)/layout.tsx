import { RootHeader } from "@/features/layout/RootHeader";
import { RootFooter } from "@/features/layout/RootFooter";
import { AudioPlayerProvider } from "@peja/ui/providers/AudioPlayerProvider";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AudioPlayerProvider>
      <RootHeader />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </AudioPlayerProvider>
  );
};

export default MarketingLayout;
