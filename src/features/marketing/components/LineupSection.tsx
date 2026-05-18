import { getLocale, getTranslations } from "next-intl/server";
import { api } from "@/lib/api/client";
import type { Musician } from "@/lib/api/types";

type DayGroup = {
  festivalDayId: string;
  date: string;
  label: string | null;
  musicians: Musician[];
};

type DayTone = "primary" | "secondary";

const groupByDay = (rows: Musician[]): DayGroup[] => {
  const map = new Map<string, DayGroup>();
  rows.forEach((m) => {
    const existing = map.get(m.festivalDayId);
    if (existing) {
      existing.musicians.push(m);
    } else {
      map.set(m.festivalDayId, {
        festivalDayId: m.festivalDayId,
        date: m.festivalDayDate,
        label: m.festivalDayLabel,
        musicians: [m],
      });
    }
  });
  return Array.from(map.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
};

const formatDayPill = (
  iso: string,
  monthsLong: string[],
  weekdaysLong: string[],
): string => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso.toUpperCase();
  const dt = new Date(Date.UTC(y, m - 1, d));
  const weekday = weekdaysLong[dt.getUTCDay()] ?? "";
  const month = monthsLong[m - 1] ?? "";
  return `${weekday}, ${month} ${d}`.toUpperCase();
};

export const LineupSection = async () => {
  const locale = await getLocale();
  const t = await getTranslations("lineup");
  const td = await getTranslations("dates");

  let rows: Musician[] = [];
  try {
    rows = await api.musicians.list(locale);
  } catch {
    rows = [];
  }

  if (rows.length === 0) return null;

  const monthsLong = td("months_long").split("|");
  const weekdaysLong = td("weekdays_long").split("|");
  const groups = groupByDay(rows);

  return (
    <section id="lineup" className="relative bg-background py-16">
      <div className="text-center pb-8 px-4">
        <h2 className="text-4xl md:text-6xl font-black mb-3">
          <span className="text-primary">{t("title")}</span> {t("year")}
        </h2>
        <div className="w-20 h-1.5 bg-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-3 max-w-7xl mx-auto px-4">
        {groups.map((group, idx) => (
          <DayCard
            key={group.festivalDayId}
            group={group}
            tone={idx % 2 === 0 ? "primary" : "secondary"}
            dayPill={formatDayPill(group.date, monthsLong, weekdaysLong)}
            headlinerLabel={t("headliner")}
          />
        ))}
      </div>
    </section>
  );
};

const toneClasses = (tone: DayTone) => {
  if (tone === "secondary") {
    return {
      border: "border-secondary/30",
      pillBg: "bg-secondary",
      pillText: "text-secondary-foreground",
      badgeBg: "bg-secondary/80",
      badgeText: "text-secondary-foreground",
    };
  }
  return {
    border: "border-primary/30",
    pillBg: "bg-primary",
    pillText: "text-primary-foreground",
    badgeBg: "bg-primary/80",
    badgeText: "text-primary-foreground",
  };
};

const DayCard = ({
  group,
  tone,
  dayPill,
  headlinerLabel,
}: {
  group: DayGroup;
  tone: DayTone;
  dayPill: string;
  headlinerLabel: string;
}) => {
  const tc = toneClasses(tone);
  const cols =
    group.musicians.length === 1
      ? "grid-cols-1"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div
      className={`relative border-2 ${tc.border} rounded-2xl overflow-hidden`}
    >
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 ${tc.pillBg} px-6 py-2 rounded-full`}
      >
        <p
          className={`${tc.pillText} font-black text-sm md:text-base whitespace-nowrap`}
        >
          {dayPill}
        </p>
      </div>

      <div className={`grid ${cols} min-h-[280px]`}>
        {group.musicians.map((m) => (
          <MusicianTile
            key={m.id}
            musician={m}
            badgeBg={tc.badgeBg}
            badgeText={tc.badgeText}
            headlinerLabel={headlinerLabel}
          />
        ))}
      </div>
    </div>
  );
};

const MusicianTile = ({
  musician,
  badgeBg,
  badgeText,
  headlinerLabel,
}: {
  musician: Musician;
  badgeBg: string;
  badgeText: string;
  headlinerLabel: string;
}) => (
  <div className="relative group overflow-hidden min-h-[280px]">
    <img
      src={musician.photoUrl}
      alt={musician.name}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
      <div className="inline-block mb-2">
        <span
          className={`${badgeBg} backdrop-blur-sm px-3 py-1 rounded-full ${badgeText} text-xs font-bold`}
        >
          {headlinerLabel}
        </span>
      </div>
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1 drop-shadow-2xl">
        {musician.name}
      </h3>
      {musician.description ? (
        <p className="text-white/80 text-sm md:text-base line-clamp-2">
          {musician.description}
        </p>
      ) : null}
    </div>
  </div>
);
