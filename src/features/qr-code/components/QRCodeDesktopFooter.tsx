"use client";

import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";

export const QRCodeDesktopFooter = () => {
  const t = useTranslations();
  return (
    <div className="tablet:flex mt-6 hidden justify-end gap-2.5">
      <Button variant="outline" className="rounded-full">
        {t("qr_code__footer__print")}
      </Button>
      <Button variant="outline" className="rounded-full">
        {t("qr_code__footer__embed")}
      </Button>
      <Button
        variant="ghost"
        className="bg-foreground text-background hover:bg-foreground/90 rounded-full"
      >
        {t("qr_code__footer__open_guest")}
      </Button>
    </div>
  );
};
