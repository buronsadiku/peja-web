"use client";

import { useState } from "react";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { CustomizerSection } from "./CustomizerSection";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type { KeepsakeProductDetail } from "@/lib/api/types";

type DigitalAlbumCustomizerProps = {
  product: KeepsakeProductDetail;
  eventId: string | null;
};

export const DigitalAlbumCustomizer = ({
  product,
  eventId,
}: DigitalAlbumCustomizerProps) => {
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeTranscripts, setIncludeTranscripts] = useState(true);

  const customization = { includeAudio, includeTranscripts };

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <CustomizerSection
        title="What's inside"
        description="Choose what goes in your downloadable album."
      >
        <div className="flex flex-col gap-3">
          <label className="inline-flex items-center gap-2">
            <Checkbox
              checked={includeAudio}
              onChange={setIncludeAudio}
            />
            <span className="type-body-small">
              Include original audio files (MP3)
            </span>
          </label>
          <label className="inline-flex items-center gap-2">
            <Checkbox
              checked={includeTranscripts}
              onChange={setIncludeTranscripts}
            />
            <span className="type-body-small">
              Include written transcripts (PDF)
            </span>
          </label>
        </div>
      </CustomizerSection>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        customization={customization}
        isReady={true}
        requiresShipping={false}
      />
    </div>
  );
};
