import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const OrderCtaStrip = () => {
  const t = useTranslations();
  return (
    <div className="rounded-16 border-destructive/30 from-destructive/10 to-accent/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border bg-gradient-to-br p-5">
      <div className="flex-1">
        <p className="type-overline text-destructive tracking-[2px]">
          {t("qr_code__order__eyebrow")}
        </p>
        <p className="tablet:type-h2 type-h3 mt-1.5 leading-snug font-semibold tracking-tight">
          {t("qr_code__order__title_a")}{" "}
          <span className="text-destructive italic">
            {t("qr_code__order__title_b")}
          </span>
        </p>
        <p className="type-body-small text-muted-foreground mt-1.5">
          {t("qr_code__order__body")}
        </p>
      </div>
      <Button
        asChild
        size="lg"
        className="shadow-primary/40 tablet:w-auto w-full rounded-full shadow-md"
      >
        <Link href={appRoutes.app.qrCodeOrder}>
          {t("qr_code__order__cta")}
        </Link>
      </Button>
    </div>
  );
};
