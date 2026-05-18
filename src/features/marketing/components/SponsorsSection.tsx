"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api/client";

const tierClass: Record<string, string> = {
  gold: "h-20",
  silver: "h-16",
  bronze: "h-12",
};

export const SponsorsSection = () => {
  const t = useTranslations("sponsors");
  const sponsorsQuery = useQuery({
    queryKey: ["sponsors"],
    queryFn: () => api.sponsors.list(),
  });

  const sponsors = sponsorsQuery.data ?? [];
  if (sponsors.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-2">
            <span className="text-primary">{t("title_a")}</span> {t("title_b")}
          </h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {sponsors.map((s) => {
            const inner = (
              <img
                src={s.logoUrl}
                alt={s.name}
                className={`${tierClass[s.tier] ?? "h-12"} w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100`}
              />
            );
            return s.url ? (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.name}
              >
                {inner}
              </a>
            ) : (
              <div key={s.id} title={s.name}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
