"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { EyeIcon } from "@peja/icons/EyeIcon";
import { Link } from "@/i18n/navigation";
import type { PublicEvent } from "@/lib/api/types";
import { KioskLiveFrame } from "./KioskLiveFrame";
import { KioskPreviewTab } from "./KioskPreviewTab";

type KioskPreviewProps = {
  slug: string | null;
  event: PublicEvent | null;
};

export const KioskPreview = ({ slug, event }: KioskPreviewProps) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("tablet");
  const TABS = [
    { label: t("kiosk__preview__tablet"), value: "tablet" },
    { label: t("kiosk__preview__phone"), value: "phone" },
    { label: t("kiosk__preview__locked"), value: "locked" },
  ];

  if (!slug || !event) {
    return (
      <div>
        <h2 className="type-h2 tracking-tight">
          {t("kiosk__preview__title")}
        </h2>
        <div className="rounded-20 border-border bg-card mt-3.5 border p-8 text-center">
          <p className="type-body-small text-muted-foreground">
            {t("kiosk__preview__no_event")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="type-h2 tracking-tight">
          {t("kiosk__preview__title")}
        </h2>
        <Button asChild size="sm" className="rounded-full">
          <Link href={`/g/${slug}`}>
            <EyeIcon width={13} height={13} />
            {t("kiosk__preview__open_as_guest")}
          </Link>
        </Button>
      </div>
      <div className="rounded-20 border-border bg-card border p-5 shadow">
        <div className="mb-3.5 flex gap-1.5">
          {TABS.map((tab) => (
            <KioskPreviewTab
              key={tab.value}
              label={tab.label}
              active={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
            />
          ))}
        </div>
        <div className="rounded-16 bg-background flex justify-center p-6">
          <div
            className="rounded-24 border-foreground/90 relative overflow-hidden border-[14px] shadow-lg"
            style={{ width: 1280 * 0.58, height: 800 * 0.58 + 28 }}
          >
            <div
              className="pointer-events-none absolute inset-0 origin-top-left"
              style={{
                transform: "scale(0.58)",
                width: 1280,
                height: 800,
              }}
            >
              <KioskLiveFrame slug={slug} event={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
