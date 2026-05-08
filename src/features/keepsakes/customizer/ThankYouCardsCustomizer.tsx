"use client";

import { useState } from "react";
import { CustomizerSection } from "./CustomizerSection";
import { OptionGroup } from "./OptionGroup";
import { VariantSelector } from "./VariantSelector";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type {
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type Design = "minimal" | "floral" | "classic";

const DESIGN_OPTIONS: Array<{ value: Design; label: string; hint: string }> = [
  { value: "minimal", label: "Minimal", hint: "Mono ink on heavy card" },
  { value: "floral", label: "Floral", hint: "Botanical illustration" },
  { value: "classic", label: "Classic", hint: "Letterpress with crest" },
];

type ThankYouCardsCustomizerProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
};

export const ThankYouCardsCustomizer = ({
  product,
  variants,
  eventId,
}: ThankYouCardsCustomizerProps) => {
  const [design, setDesign] = useState<Design>("minimal");
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [messageText, setMessageText] = useState("");

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const quantity =
    (selectedVariant?.attributes?.quantity as number | undefined) ?? null;

  const customization = {
    design,
    quantity,
    messageText: messageText.trim() || undefined,
  };

  const isReady = !!variantId;

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <CustomizerSection title="Design" description="Pick a card style.">
          <OptionGroup
            label="Style"
            value={design}
            options={DESIGN_OPTIONS}
            onChange={setDesign}
          />
        </CustomizerSection>

        <CustomizerSection title="Quantity" description="Pick a card pack.">
          <VariantSelector
            label="Pack size"
            variants={variants}
            basePriceCents={product.basePriceCents}
            selectedId={variantId}
            onChange={setVariantId}
          />
        </CustomizerSection>

        <CustomizerSection
          title="Message"
          description="Printed inside each card. Up to 280 characters."
          badge={`${messageText.length}/280`}
        >
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value.slice(0, 280))}
            rows={4}
            placeholder="Thank you for celebrating with us…"
            className="rounded-12 border-border bg-background type-body-small focus-visible:ring-ring focus-visible:ring-offset-background w-full resize-none border p-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        </CustomizerSection>
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        customization={customization}
        selectedVariant={selectedVariant}
        isReady={isReady}
        notReadyMessage="Pick a quantity to continue."
      />
    </div>
  );
};
