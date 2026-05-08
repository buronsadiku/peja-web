"use client";

import { useState } from "react";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { CustomizerSection } from "./CustomizerSection";
import { OptionGroup } from "./OptionGroup";
import { VariantSelector } from "./VariantSelector";
import { AudioMessagePicker } from "./AudioMessagePicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type {
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type CoverColor = "black" | "ivory" | "blush";
type Layout = "classic" | "modern" | "mixed";

const COVER_OPTIONS: Array<{ value: CoverColor; label: string }> = [
  { value: "black", label: "Black" },
  { value: "ivory", label: "Ivory" },
  { value: "blush", label: "Blush" },
];

const LAYOUT_OPTIONS: Array<{ value: Layout; label: string; hint: string }> = [
  { value: "classic", label: "Classic", hint: "One message per page" },
  { value: "modern", label: "Modern", hint: "Photo-led spreads" },
  { value: "mixed", label: "Mixed", hint: "Editorial layout" },
];

type GoldBookCustomizerProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
};

export const GoldBookCustomizer = ({
  product,
  variants,
  eventId,
}: GoldBookCustomizerProps) => {
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [coverColor, setCoverColor] = useState<CoverColor>("ivory");
  const [layout, setLayout] = useState<Layout>("classic");
  const [coverText, setCoverText] = useState("");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeTranscripts, setIncludeTranscripts] = useState(true);
  const [messageIds, setMessageIds] = useState<string[]>([]);

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const formatAttr =
    (selectedVariant?.attributes?.format as string | undefined) ?? null;

  const toggleMessage = (id: string) =>
    setMessageIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = {
    coverColor,
    layout,
    format: formatAttr,
    coverText: coverText.trim(),
    includePhotos,
    includeTranscripts,
    messageIds,
  };

  const isReady = messageIds.length > 0;

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        {variants.length > 0 && (
          <CustomizerSection
            title="Format"
            description="Pick your book size."
          >
            <VariantSelector
              label="Size"
              variants={variants}
              basePriceCents={product.basePriceCents}
              selectedId={variantId}
              onChange={setVariantId}
            />
          </CustomizerSection>
        )}
        <CustomizerSection
          title="Cover"
          description="Choose your finish and personalize the front."
        >
          <OptionGroup
            label="Cover color"
            value={coverColor}
            options={COVER_OPTIONS}
            onChange={setCoverColor}
          />
          <div>
            <Label htmlFor="gb-cover-text" className="mb-2">
              Cover text
            </Label>
            <Input
              id="gb-cover-text"
              maxLength={120}
              value={coverText}
              onChange={(e) => setCoverText(e.target.value)}
              placeholder="Anna & Marc · 14 June 2025"
            />
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Layout"
          description="How pages flow inside the book."
        >
          <OptionGroup
            label="Layout style"
            value={layout}
            options={LAYOUT_OPTIONS}
            onChange={setLayout}
          />
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2">
              <Checkbox
                checked={includePhotos}
                onChange={setIncludePhotos}
              />
              <span className="type-body-small">Include guest photos</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <Checkbox
                checked={includeTranscripts}
                onChange={setIncludeTranscripts}
              />
              <span className="type-body-small">
                Include audio transcripts
              </span>
            </label>
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Messages"
          description="Pick the audio messages to include in the book."
          badge={`${messageIds.length} selected`}
        >
          <AudioMessagePicker
            eventId={eventId}
            selectedIds={messageIds}
            onToggle={toggleMessage}
            onSelectAll={setMessageIds}
            emptyHint="No audio messages yet. Invite guests to record."
          />
        </CustomizerSection>
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        customization={customization}
        selectedVariant={selectedVariant}
        isReady={isReady}
        notReadyMessage="Pick at least one message to continue."
      />
    </div>
  );
};
