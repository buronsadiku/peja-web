import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { LockIcon } from "@peja/icons/LockIcon";
import { AddressField } from "./AddressField";
import type { OrderState } from "../types";

type PaymentStepProps = {
  state: OrderState;
  setField: (
    field: keyof Pick<
      OrderState,
      "cardNumber" | "cardExpiry" | "cardCvc" | "cardholderName"
    >,
    value: string,
  ) => void;
};

export const PaymentStep = ({ state, setField }: PaymentStepProps) => {
  const t = useTranslations();
  return (
    <div>
      <Kicker className="text-primary">
        {t("qr_cards_order__payment__eyebrow")}
      </Kicker>
      <h1 className="type-h1 mt-2.5 leading-tight font-semibold tracking-tight">
        {t("qr_cards_order__payment__title_a")}{" "}
        <span className="text-primary italic">
          {t("qr_cards_order__payment__title_b")}
        </span>
      </h1>

      <div className="mt-6 grid gap-2.5 tablet:grid-cols-2">
        <button
          type="button"
          className="rounded-12 type-body bg-foreground text-background flex h-12 items-center justify-center font-semibold"
        >
          Pay — Apple Pay
        </button>
        <button
          type="button"
          className="rounded-12 type-body border-border bg-card text-foreground hover:bg-muted flex h-12 items-center justify-center border font-semibold"
        >
          G Pay — Google Pay
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="type-overline text-muted-foreground tracking-wider">
          {t("qr_cards_order__payment__or_card")}
        </span>
        <div className="bg-border h-px flex-1" />
      </div>

      <AddressField
        label={t("qr_cards_order__payment__card_number")}
        value={state.cardNumber}
        onChange={(v) => setField("cardNumber", v)}
        placeholder="4242 4242 4242 4242"
      />
      <div className="mt-3.5 grid gap-3.5 tablet:grid-cols-3">
        <AddressField
          label={t("qr_cards_order__payment__expiry")}
          value={state.cardExpiry}
          onChange={(v) => setField("cardExpiry", v)}
          placeholder="MM / YY"
        />
        <AddressField
          label={t("qr_cards_order__payment__cvc")}
          value={state.cardCvc}
          onChange={(v) => setField("cardCvc", v)}
          placeholder="•••"
        />
        <AddressField
          label={t("qr_cards_order__shipping__postcode")}
          value={state.postcode}
          onChange={() => {}}
        />
      </div>
      <div className="mt-3.5">
        <AddressField
          label={t("qr_cards_order__payment__cardholder")}
          value={state.cardholderName}
          onChange={(v) => setField("cardholderName", v)}
        />
      </div>

      <div className="rounded-12 bg-secondary/15 border-secondary/40 mt-6 flex items-start gap-2.5 border p-3.5">
        <LockIcon width={18} height={18} className="text-secondary mt-0.5 shrink-0" />
        <p className="type-body-small text-secondary leading-relaxed">
          {t("qr_cards_order__payment__stripe_note")}
        </p>
      </div>
    </div>
  );
};
