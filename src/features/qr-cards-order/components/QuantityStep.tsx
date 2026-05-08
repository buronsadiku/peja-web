import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { PaperOption } from "./PaperOption";
import type { OrderState, PaperKey } from "../types";

type QuantityStepProps = {
  state: OrderState;
  setQuantity: (n: number) => void;
  setPaper: (p: PaperKey) => void;
};

const TIERS = [25, 50, 100, 150];

export const QuantityStep = ({
  state,
  setQuantity,
  setPaper,
}: QuantityStepProps) => {
  const t = useTranslations();
  const papers: {
    key: PaperKey;
    title: string;
    description: string;
    priceLabel: string;
    badge?: string;
  }[] = [
    {
      key: "standard",
      title: t("qr_cards_order__qty__paper_standard_t"),
      description: t("qr_cards_order__qty__paper_standard_d"),
      priceLabel: "€0",
    },
    {
      key: "letter",
      title: t("qr_cards_order__qty__paper_letter_t"),
      description: t("qr_cards_order__qty__paper_letter_d"),
      priceLabel: "+€1.20 each",
      badge: t("qr_cards_order__qty__most_chosen"),
    },
    {
      key: "vellum",
      title: t("qr_cards_order__qty__paper_vellum_t"),
      description: t("qr_cards_order__qty__paper_vellum_d"),
      priceLabel: "+€2.40 each",
    },
  ];

  return (
    <div>
      <Kicker className="text-primary">
        {t("qr_cards_order__qty__eyebrow")}
      </Kicker>
      <h1 className="type-h1 mt-2.5 leading-tight font-semibold tracking-tight">
        {t("qr_cards_order__qty__title_a")}{" "}
        <span className="text-primary italic">
          {t("qr_cards_order__qty__title_b")}
        </span>
      </h1>
      <p className="type-body-small text-muted-foreground mt-2.5 max-w-xl leading-relaxed">
        {t("qr_cards_order__qty__body")}
      </p>

      <div className="mt-8">
        <p className="type-overline text-muted-foreground mb-2.5 font-semibold tracking-wider">
          {t("qr_cards_order__qty__quantity_label")}
        </p>
        <div className="border-primary bg-card ring-primary/20 rounded-12 inline-flex items-center gap-2.5 border-2 p-2 ring-4">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, state.quantity - 1))}
            className="border-border bg-card hover:bg-muted flex size-8 items-center justify-center rounded-full border"
          >
            −
          </button>
          <span className="type-h2 min-w-16 text-center font-semibold tracking-tight">
            {state.quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(state.quantity + 1)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-8 items-center justify-center rounded-full"
          >
            +
          </button>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {TIERS.map((n) => {
            const active = n === state.quantity;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setQuantity(n)}
                className={
                  "rounded-full px-3.5 py-1.5 type-caption font-semibold transition " +
                  (active
                    ? "bg-primary/15 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted border")
                }
              >
                {n} {t("qr_cards_order__qty__cards_suffix")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="type-overline text-muted-foreground mb-2.5 font-semibold tracking-wider">
          {t("qr_cards_order__qty__paper_label")}
        </p>
        <div className="flex flex-col gap-2.5">
          {papers.map((p) => (
            <PaperOption
              key={p.key}
              title={p.title}
              description={p.description}
              priceLabel={p.priceLabel}
              badge={p.badge}
              selected={state.paper === p.key}
              onSelect={() => setPaper(p.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
