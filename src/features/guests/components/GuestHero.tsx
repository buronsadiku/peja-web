"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { LinkIcon } from "@peja/icons/LinkIcon";
import { ContributionRing } from "./ContributionRing";

type GuestHeroProps = {
  totalMessages: number;
  totalGuests: number;
  totalInvited: number;
  inviteUrl: string;
};

export const GuestHero = ({
  totalMessages,
  totalGuests,
  totalInvited,
  inviteUrl,
}: GuestHeroProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-20 bg-card tablet:p-10 desktop:p-12 relative overflow-hidden p-8">
      <div className="bg-primary/10 absolute -top-15 -right-15 size-80 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] relative grid items-end gap-10">
        <div>
          <span className="type-overline text-primary">
            {t("guests__hero__eyebrow")}
          </span>
          <h1 className="type-display mt-2.5 tracking-tight">
            {t.rich("guests__hero__title", {
              count: totalMessages,
              emph: (chunks) => (
                <span className="text-primary italic">{chunks}</span>
              ),
            })}
          </h1>
          <p className="type-body text-muted-foreground mt-3.5 max-w-xl">
            {t("guests__hero__subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={handleCopy}
            >
              <LinkIcon width={14} height={14} />
              {copied
                ? t("guests__hero__copied")
                : t("guests__hero__copy_link")}
            </Button>
          </div>
        </div>
        <ContributionRing
          value={totalGuests}
          total={Math.max(totalInvited, totalGuests, 1)}
        />
      </div>
    </div>
  );
};
