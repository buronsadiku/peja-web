"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { GiftIcon } from "@peja/icons/GiftIcon";

export const BundleBanner = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-accent from-accent/15 to-destructive/10 tablet:flex-row tablet:items-center tablet:gap-4.5 flex flex-col gap-4 border border-dashed bg-linear-to-br p-5">
      <div className="rounded-12 bg-accent flex size-11 shrink-0 items-center justify-center">
        <GiftIcon width={20} height={20} className="text-white" />
      </div>
      <div className="flex-1">
        <p
          className="type-overline tracking-[1.5px]"
          style={{ color: "#9A6B2F" }}
        >
          {t("keepsakes__bundle__eyebrow")}
        </p>
        <p className="type-h4 mt-1 leading-snug font-semibold">
          {t.rich("keepsakes__bundle__title", {
            emph: (chunks) => (
              <span className="italic" style={{ color: "#C88C36" }}>
                {chunks}
              </span>
            ),
          })}
        </p>
      </div>
      <Button
        size="lg"
        className="bg-foreground text-background hover:bg-foreground/90 tablet:w-auto w-full rounded-full"
      >
        {t("keepsakes__bundle__action")} <ArrowRightIcon width={13} height={13} />
      </Button>
    </div>
  );
};
