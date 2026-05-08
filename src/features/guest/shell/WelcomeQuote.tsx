import type { PublicEvent } from "@/lib/api/types";

type WelcomeQuoteProps = {
  event: PublicEvent;
};

export const WelcomeQuote = ({ event }: WelcomeQuoteProps) => {
  if (!event.welcomeMessage) return null;
  return (
    <div className="bg-card border-border rounded-20 relative border p-5 shadow-sm">
      <span className="text-accent type-display absolute -top-2.5 left-4 italic leading-none">
        &ldquo;
      </span>
      <p className="text-foreground type-body pl-3.5 font-serif italic leading-relaxed">
        {event.welcomeMessage}
      </p>
      <p className="text-muted-foreground mt-2.5 text-right font-serif type-caption italic">
        — {event.partnerAName.charAt(0)} &amp; {event.partnerBName.charAt(0)}
      </p>
    </div>
  );
};
