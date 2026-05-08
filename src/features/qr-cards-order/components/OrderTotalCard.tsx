import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { QRCardPreview } from "./QRCardPreview";
import { formatEuro, type Pricing } from "../pricing";
import { PAPER_PRICE_PER_CARD, type OrderState } from "../types";

type OrderTotalCardProps = {
  state: OrderState;
  pricing: Pricing;
  ctaLabel: string;
  onContinue: () => void;
  onBack?: () => void;
  backLabel?: string;
};

const paperLabel: Record<OrderState["paper"], string> = {
  standard: "Standard",
  letter: "Letterpress cotton",
  vellum: "Vellum",
};

export const OrderTotalCard = ({
  state,
  pricing,
  ctaLabel,
  onContinue,
  onBack,
  backLabel,
}: OrderTotalCardProps) => {
  const t = useTranslations();
  const lines = [
    {
      label: `${state.quantity} × ${formatEuro(PAPER_PRICE_PER_CARD[state.paper])}`,
      value: formatEuro(pricing.cardsTotal),
    },
    {
      label: t("qr_cards_order__shipping_label"),
      value: formatEuro(pricing.shipping),
    },
    {
      label: t("qr_cards_order__vat"),
      value: formatEuro(pricing.vat),
    },
  ];
  return (
    <div className="rounded-16 border-border bg-card sticky top-6 border p-6">
      <p className="type-overline text-muted-foreground font-semibold tracking-wider">
        {t("qr_cards_order__order_summary")}
      </p>

      <div className="mx-auto my-5 w-32">
        <QRCardPreview cardColor={state.cardColor} />
      </div>
      <p className="type-caption text-muted-foreground text-center font-serif italic">
        {paperLabel[state.paper]} · {state.quantity} cards
      </p>

      <div className="bg-border my-4 h-px" />

      {lines.map((line) => (
        <div
          key={line.label}
          className="type-body-small mb-2.5 flex justify-between"
        >
          <span className="text-muted-foreground">{line.label}</span>
          <span className="text-foreground font-mono">{line.value}</span>
        </div>
      ))}

      <div className="bg-border my-3 h-px" />

      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-body font-semibold">
          {t("qr_cards_order__total")}
        </span>
        <span className="type-h2 font-semibold tracking-tight">
          {formatEuro(pricing.total)}
        </span>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        onClick={onContinue}
      >
        {ctaLabel}
        <ArrowRightIcon width={14} height={14} />
      </Button>
      {onBack && (
        <Button
          size="lg"
          variant="ghost"
          className="mt-2.5 w-full rounded-full"
          onClick={onBack}
        >
          {backLabel ?? t("qr_cards_order__back")}
        </Button>
      )}
    </div>
  );
};
