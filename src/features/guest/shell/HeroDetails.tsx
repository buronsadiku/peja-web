import { getLocale, getTranslations } from "next-intl/server";
import type { PublicEvent } from "@/lib/api/types";

type HeroDetailsProps = {
  event: PublicEvent;
};

const formatWeddingDate = (raw: string | null, locale: string): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d
    .toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/[\s/-]/g, " · ");
};

export const HeroDetails = async ({ event }: HeroDetailsProps) => {
  const t = await getTranslations();
  const locale = await getLocale();
  const dateLabel = formatWeddingDate(event.weddingDate, locale);

  return (
    <div className="text-center">
      <p className="type-overline text-primary mb-2.5">
        {t("guest__landing__welcome_overline")}
      </p>
      <h1 className="type-h1 font-semibold leading-none tracking-tight">
        {event.partnerAName}{" "}
        <span className="text-primary italic">&amp;</span>{" "}
        {event.partnerBName}
      </h1>
      {dateLabel && (
        <p className="type-caption text-muted-foreground mt-2.5 font-mono tracking-wider">
          {dateLabel}
        </p>
      )}
    </div>
  );
};
