"use client";

import { useTranslations } from "next-intl";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { MicIcon } from "@peja/icons/MicIcon";
import { HourglassIcon } from "@peja/icons/HourglassIcon";
import { PillBase } from "./PillBase";

type GuestStatusPillProps = {
  contributed: boolean;
  thanked: boolean;
  wasNudged?: boolean;
};

export const GuestStatusPill = ({
  contributed,
  thanked,
  wasNudged,
}: GuestStatusPillProps) => {
  const t = useTranslations();
  if (contributed && thanked) {
    return (
      <PillBase className="bg-secondary/20 text-secondary-foreground">
        <CheckIcon width={11} height={11} />
        {t("guests__pill__contributed_thanked")}
      </PillBase>
    );
  }

  if (contributed) {
    return (
      <PillBase className="bg-primary/15 text-primary">
        <MicIcon width={11} height={11} />
        {t("guests__pill__contributed")}
      </PillBase>
    );
  }

  if (wasNudged) {
    return (
      <PillBase className="bg-accent/25 text-accent-foreground">
        <HourglassIcon width={11} height={11} />
        {t("guests__pill__nudged")}
      </PillBase>
    );
  }

  return (
    <PillBase className="bg-muted text-muted-foreground">
      <HourglassIcon width={11} height={11} />
      {t("guests__pill__awaiting")}
    </PillBase>
  );
};
