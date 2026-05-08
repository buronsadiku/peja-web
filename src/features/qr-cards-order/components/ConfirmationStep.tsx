import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { formatEuro } from "../pricing";
import type { OrderState } from "../types";
import type { Pricing } from "../pricing";

type ConfirmationStepProps = {
  state: OrderState;
  pricing: Pricing;
  orderId: string;
};

export const ConfirmationStep = ({
  state,
  pricing,
  orderId,
}: ConfirmationStepProps) => {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="bg-secondary text-secondary-foreground ring-secondary/20 mx-auto mb-6 flex size-20 items-center justify-center rounded-full ring-8">
        <CheckIcon width={40} height={40} strokeWidth={3} />
      </span>
      <p className="type-overline text-primary font-semibold tracking-widest">
        {t("qr_cards_order__confirm__eyebrow")}
      </p>
      <h1 className="type-h1 mt-3.5 leading-tight font-semibold tracking-tight">
        {t("qr_cards_order__confirm__title_a")}
        <br />
        <span className="text-primary italic">
          {t("qr_cards_order__confirm__title_b")}
        </span>
      </h1>
      <p className="type-body-small text-muted-foreground mt-4 leading-relaxed">
        {t("qr_cards_order__confirm__body")}{" "}
        <span className="text-foreground font-mono font-semibold">
          #{orderId}
        </span>
      </p>

      <div className="rounded-16 border-border bg-card mt-10 grid gap-5 border p-6 text-left tablet:grid-cols-2">
        <div>
          <p className="type-overline text-muted-foreground font-semibold tracking-wider">
            Shipping to
          </p>
          <p className="type-body-small mt-1.5 leading-relaxed">
            <span className="font-semibold">
              {state.firstName} {state.lastName}
            </span>
            <br />
            {state.address1}
            {state.address2 && ` · ${state.address2}`}
            <br />
            {state.postcode} {state.city} · {state.country}
          </p>
        </div>
        <div>
          <p className="type-overline text-muted-foreground font-semibold tracking-wider">
            Charged today
          </p>
          <p className="type-h1 mt-1.5 font-semibold tracking-tight">
            {formatEuro(pricing.total)}
          </p>
          <p className="type-caption text-muted-foreground mt-0.5">
            {state.cardNumber
              ? `Card ·· ${state.cardNumber.slice(-4)}`
              : "Receipt emailed"}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Button asChild size="lg" className="rounded-full">
          <Link href={appRoutes.app.root}>
            {t("qr_cards_order__confirm__back_dashboard")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
