"use client";

import { useState } from "react";
import { CustomizerSection } from "./CustomizerSection";
import { MediaPicker } from "./MediaPicker";
import { VariantSelector } from "./VariantSelector";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type {
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type CanvasPrintCustomizerProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
};

export const CanvasPrintCustomizer = ({
  product,
  variants,
  eventId,
}: CanvasPrintCustomizerProps) => {
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  const selectedVariant =
    variants.find((v) => v.id === variantId) ?? null;
  const sizeAttr =
    (selectedVariant?.attributes?.size as string | undefined) ?? null;

  const togglePhoto = (id: string) =>
    setSelectedMediaIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = {
    size: sizeAttr,
    selectedMediaIds,
  };
  const isReady = selectedMediaIds.length > 0 && !!variantId;

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <CustomizerSection title="Size" description="Pick the canvas size.">
          <VariantSelector
            label="Dimensions"
            variants={variants}
            basePriceCents={product.basePriceCents}
            selectedId={variantId}
            onChange={setVariantId}
          />
        </CustomizerSection>

        <CustomizerSection
          title="Photos"
          description="Pick the photos to feature in the collage."
          badge={`${selectedMediaIds.length} selected`}
        >
          <MediaPicker
            eventId={eventId}
            type="photo"
            selectedIds={selectedMediaIds}
            onToggle={togglePhoto}
            emptyHint="No photos yet. Invite guests to upload."
          />
        </CustomizerSection>
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        customization={customization}
        selectedVariant={selectedVariant}
        isReady={isReady}
        notReadyMessage="Pick a size and at least one photo."
      />
    </div>
  );
};
