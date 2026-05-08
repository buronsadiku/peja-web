import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { SwatchOption } from "./SwatchOption";
import { QRCardPreview } from "./QRCardPreview";
import type { OrderState } from "../types";

type DesignStepProps = {
  state: OrderState;
  setCardColor: (c: string) => void;
  setInkColor: (c: string) => void;
  setProofConfirmed: (b: boolean) => void;
};

const CARD_COLORS = [
  { c: "#F9F7F4", n: "Ivory" },
  { c: "#E9DED0", n: "Sand" },
  { c: "#B9C9D9", n: "Dusk" },
  { c: "#2D2D2D", n: "Ink" },
];
const INK_COLORS = [
  { c: "#2D2D2D", n: "Soft black" },
  { c: "#5E86DC", n: "Cornflower" },
  { c: "#EC8662", n: "Peach foil" },
  { c: "#C9A04B", n: "Gold foil" },
];

export const DesignStep = ({
  state,
  setCardColor,
  setInkColor,
  setProofConfirmed,
}: DesignStepProps) => {
  const t = useTranslations();
  return (
    <div className="grid gap-10 desktop:grid-cols-2">
      <div className="rounded-16 from-primary to-primary/70 flex aspect-[3/4] items-center justify-center bg-gradient-to-br p-10 desktop:aspect-auto">
        <QRCardPreview cardColor={state.cardColor} className="w-3/4 max-w-sm" />
      </div>
      <div>
        <Kicker className="text-primary">
          {t("qr_cards_order__design__eyebrow")}
        </Kicker>
        <h1 className="type-h1 mt-2.5 leading-tight font-semibold tracking-tight">
          {t("qr_cards_order__design__title_a")}{" "}
          <span className="text-primary italic">
            {t("qr_cards_order__design__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-2.5 max-w-xl leading-relaxed">
          {t("qr_cards_order__design__body")}
        </p>

        <div className="mt-6">
          <p className="type-overline text-muted-foreground mb-2.5 font-semibold tracking-wider">
            {t("qr_cards_order__design__color_label")}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {CARD_COLORS.map((c) => (
              <SwatchOption
                key={c.n}
                color={c.c}
                name={c.n}
                selected={state.cardColor === c.c}
                onSelect={() => setCardColor(c.c)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="type-overline text-muted-foreground mb-2.5 font-semibold tracking-wider">
            {t("qr_cards_order__design__ink_label")}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {INK_COLORS.map((c) => (
              <SwatchOption
                key={c.n}
                color={c.c}
                name={c.n}
                selected={state.inkColor === c.c}
                onSelect={() => setInkColor(c.c)}
              />
            ))}
          </div>
        </div>

        <label className="rounded-12 bg-secondary/15 border-secondary/40 mt-6 flex cursor-pointer items-start gap-2.5 border p-3.5">
          <input
            type="checkbox"
            checked={state.proofConfirmed}
            onChange={(e) => setProofConfirmed(e.target.checked)}
            className="sr-only"
          />
          <span
            className={
              "rounded-6 mt-0.5 flex size-5 shrink-0 items-center justify-center " +
              (state.proofConfirmed
                ? "bg-secondary text-secondary-foreground"
                : "border-border bg-card border")
            }
          >
            {state.proofConfirmed && (
              <CheckIcon width={12} height={12} strokeWidth={3} />
            )}
          </span>
          <span className="type-body-small text-muted-foreground leading-relaxed">
            {t("qr_cards_order__design__confirm_proof")}
          </span>
        </label>
      </div>
    </div>
  );
};
