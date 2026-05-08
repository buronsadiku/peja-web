"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Link } from "@/i18n/navigation";

type QRCodeHeaderProps = {
  guestSlug?: string;
};

export const QRCodeHeader = ({ guestSlug }: QRCodeHeaderProps) => {
  const t = useTranslations();
  return (
    <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-5">
      <div className="min-w-0">
        <h1 className="tablet:type-h1 type-h1 leading-tight font-semibold tracking-tight">
          {t("qr__header__title_a")}{" "}
          <span className="text-primary italic">
            {t("qr__header__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-2 max-w-130 leading-relaxed">
          {t("qr__header__subtitle")}
        </p>
      </div>
      <div className="desktop:flex hidden shrink-0 gap-2">
        <Button
          asChild
          variant="outline"
          className="rounded-full whitespace-nowrap"
          disabled={!guestSlug}
        >
          <Link href={guestSlug ? `/g/${guestSlug}` : "#"} target="_blank">
            {t("qr__header__preview")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
