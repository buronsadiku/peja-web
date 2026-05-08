"use client";

import { useTranslations } from "next-intl";
import { KioskChecklistItem } from "./KioskChecklistItem";

const ITEM_KEYS = [
  {
    titleKey: "kiosk__checklist__charger__title",
    descKey: "kiosk__checklist__charger__desc",
    done: true,
  },
  {
    titleKey: "kiosk__checklist__stand__title",
    descKey: "kiosk__checklist__stand__desc",
    done: true,
  },
  {
    titleKey: "kiosk__checklist__volume__title",
    descKey: "kiosk__checklist__volume__desc",
    done: true,
  },
  {
    titleKey: "kiosk__checklist__dnd__title",
    descKey: "kiosk__checklist__dnd__desc",
    done: false,
  },
  {
    titleKey: "kiosk__checklist__airplane__title",
    descKey: "kiosk__checklist__airplane__desc",
    done: true,
  },
  {
    titleKey: "kiosk__checklist__test__title",
    descKey: "kiosk__checklist__test__desc",
    done: false,
    ctaKey: "kiosk__checklist__test__cta",
  },
];

export const KioskChecklist = () => {
  const t = useTranslations();
  const items = ITEM_KEYS.map((item) => ({
    title: t(item.titleKey),
    description: t(item.descKey),
    done: item.done,
    cta: item.ctaKey ? t(item.ctaKey) : undefined,
  }));
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="type-h2 tracking-tight">
          {t("kiosk__checklist__title")}
        </h2>
        <span className="type-caption text-muted-foreground">
          {t.rich("kiosk__checklist__progress", {
            done: doneCount,
            total: items.length,
            strong: (chunks) => (
              <strong className="text-foreground">{chunks}</strong>
            ),
          })}
        </span>
      </div>
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
        {items.map((item) => (
          <KioskChecklistItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};
