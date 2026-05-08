"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StepIndicator } from "./components/StepIndicator";
import { QuantityStep } from "./components/QuantityStep";
import { DesignStep } from "./components/DesignStep";
import { ShippingStep } from "./components/ShippingStep";
import { PaymentStep } from "./components/PaymentStep";
import { ConfirmationStep } from "./components/ConfirmationStep";
import { OrderTotalCard } from "./components/OrderTotalCard";
import { calcPricing } from "./pricing";
import type {
  OrderState,
  PaperKey,
  ShippingMethodKey,
} from "./types";

const INITIAL_STATE: OrderState = {
  quantity: 100,
  paper: "letter",
  cardColor: "#F9F7F4",
  inkColor: "#2D2D2D",
  proofConfirmed: false,
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  postcode: "",
  country: "",
  phone: "",
  shippingMethod: "express",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardholderName: "",
};

const generateOrderId = () =>
  `OV-${Math.floor(10000 + Math.random() * 90000)}`;

export const QRCardsOrderPage = () => {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OrderState>(INITIAL_STATE);
  const [orderId] = useState(generateOrderId);
  const pricing = calcPricing(state);

  const update = <K extends keyof OrderState>(key: K, value: OrderState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const goNext = () => setStep((s) => Math.min(5, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="bg-background min-h-screen">
      <StepIndicator step={step} />
      <div className="mx-auto max-w-7xl px-5 py-10 tablet:px-10 tablet:py-12">
        {step === 1 && (
          <div className="grid gap-10 desktop:grid-cols-[1fr_380px]">
            <QuantityStep
              state={state}
              setQuantity={(n) => update("quantity", n)}
              setPaper={(p: PaperKey) => update("paper", p)}
            />
            <OrderTotalCard
              state={state}
              pricing={pricing}
              ctaLabel={t("qr_cards_order__qty__continue")}
              onContinue={goNext}
            />
          </div>
        )}
        {step === 2 && (
          <div>
            <DesignStep
              state={state}
              setCardColor={(c) => update("cardColor", c)}
              setInkColor={(c) => update("inkColor", c)}
              setProofConfirmed={(b) => update("proofConfirmed", b)}
            />
            <div className="mt-8 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border-border bg-card hover:bg-muted type-body border px-5 py-3 font-semibold"
              >
                ← {t("qr_cards_order__back")}
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!state.proofConfirmed}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 type-body px-6 py-3 font-semibold"
              >
                {t("qr_cards_order__design__continue")} →
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-10 desktop:grid-cols-[1fr_380px]">
            <ShippingStep
              state={state}
              setField={(field, value) => update(field, value)}
              setShippingMethod={(m: ShippingMethodKey) =>
                update("shippingMethod", m)
              }
            />
            <OrderTotalCard
              state={state}
              pricing={pricing}
              ctaLabel={t("qr_cards_order__shipping__continue")}
              onContinue={goNext}
              onBack={goBack}
            />
          </div>
        )}
        {step === 4 && (
          <div className="grid gap-10 desktop:grid-cols-[1fr_380px]">
            <PaymentStep
              state={state}
              setField={(field, value) => update(field, value)}
            />
            <OrderTotalCard
              state={state}
              pricing={pricing}
              ctaLabel={t("qr_cards_order__payment__place_order")}
              onContinue={goNext}
              onBack={goBack}
            />
          </div>
        )}
        {step === 5 && (
          <ConfirmationStep
            state={state}
            pricing={pricing}
            orderId={orderId}
          />
        )}
      </div>
    </div>
  );
};
