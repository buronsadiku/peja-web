import type { ReactNode } from "react";
import type { PublicEvent } from "@/lib/api/types";
import { GuestHero } from "./GuestHero";
import { LanguagePicker } from "./LanguagePicker";

type GuestWizardShellProps = {
  event: PublicEvent;
  children: ReactNode;
};

const heroBackgroundStyle = (themeColor: string) => ({
  backgroundImage: `
    radial-gradient(60% 40% at 90% 0%, color-mix(in oklch, ${themeColor} 35%, transparent), transparent 65%),
    radial-gradient(50% 35% at -10% 35%, color-mix(in oklch, var(--destructive) 25%, transparent), transparent 65%),
    radial-gradient(50% 35% at 110% 95%, color-mix(in oklch, var(--accent) 25%, transparent), transparent 65%)
  `,
});

export const GuestWizardShell = ({
  event,
  children,
}: GuestWizardShellProps) => (
  <div className="bg-warm-cream small-desktop:flex-row flex min-h-screen flex-col">
    <aside
      className="small-desktop:w-2/5 small-desktop:h-screen small-desktop:sticky small-desktop:top-0 small-desktop:overflow-y-auto relative flex flex-col gap-6 px-5 pt-4 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-8"
      style={heroBackgroundStyle(event.themeColor)}
    >
      <div className="flex items-center justify-between">
        <LanguagePicker />
      </div>
      <div className="small-desktop:my-auto small-desktop:max-w-md small-desktop:mx-auto flex flex-col gap-6_5">
        <GuestHero event={event} />
      </div>
    </aside>
    <main className="small-desktop:w-3/5 small-desktop:h-screen small-desktop:overflow-y-auto bg-background relative flex flex-1 flex-col">
      {children}
    </main>
  </div>
);
