"use client";

import { useTranslations } from "next-intl";
import { TestimonialCard } from "./TestimonialCard";

export const TestimonialStrip = () => {
  const t = useTranslations();
  const testimonials = [1, 2, 3].map((n) => ({
    quote: t(`keepsakes__testimonial__${n}__quote`),
    couple: t(`keepsakes__testimonial__${n}__couple`),
    location: t(`keepsakes__testimonial__${n}__location`),
  }));

  return (
    <div className="rounded-20 bg-foreground text-background tablet:grid-cols-3 relative grid gap-5 overflow-hidden p-7">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(400px 200px at 80% 50%, oklch(0.818 0.105 73.3 / 0.2), transparent 70%)",
        }}
      />
      {testimonials.map((item) => (
        <TestimonialCard key={item.couple} {...item} />
      ))}
    </div>
  );
};
