"use client";

import { useState } from "react";
import { Input } from "@peja/ui/components/Input";
import { Label } from "@peja/ui/components/Label";
import { CustomizerSection } from "./CustomizerSection";
import { OptionGroup } from "./OptionGroup";
import { AudioMessagePicker } from "./AudioMessagePicker";
import { MediaPicker } from "./MediaPicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type { KeepsakeProductDetail } from "@/lib/api/types";

type Style = "cinematic" | "romantic" | "upbeat";

const STYLE_OPTIONS: Array<{ value: Style; label: string; hint: string }> = [
  { value: "cinematic", label: "Cinematic", hint: "Slow pans, warm grade" },
  { value: "romantic", label: "Romantic", hint: "Soft cuts, gentle tempo" },
  { value: "upbeat", label: "Upbeat", hint: "Quick cuts, bright" },
];

type VideoMontageCustomizerProps = {
  product: KeepsakeProductDetail;
  eventId: string | null;
};

export const VideoMontageCustomizer = ({
  product,
  eventId,
}: VideoMontageCustomizerProps) => {
  const [style, setStyle] = useState<Style>("cinematic");
  const [durationSec, setDurationSec] = useState(120);
  const [musicTrackId, setMusicTrackId] = useState("");
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const [mediaIds, setMediaIds] = useState<string[]>([]);

  const toggleMessage = (id: string) =>
    setMessageIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  const toggleMedia = (id: string) =>
    setMediaIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = {
    style,
    durationSec,
    musicTrackId: musicTrackId.trim() || undefined,
    messageIds,
    mediaIds,
  };

  const isReady = messageIds.length > 0 || mediaIds.length > 0;

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <CustomizerSection title="Style" description="The mood of the montage.">
          <OptionGroup
            label="Style"
            value={style}
            options={STYLE_OPTIONS}
            onChange={setStyle}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vm-duration" className="mb-2">
                Length (seconds)
              </Label>
              <Input
                id="vm-duration"
                type="number"
                min={60}
                max={300}
                value={durationSec}
                onChange={(e) =>
                  setDurationSec(
                    Math.max(60, Math.min(300, Number(e.target.value) || 60)),
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="vm-music" className="mb-2">
                Music track ID (optional)
              </Label>
              <Input
                id="vm-music"
                value={musicTrackId}
                onChange={(e) => setMusicTrackId(e.target.value)}
                placeholder="track_warm_strings"
              />
            </div>
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Audio messages"
          description="Voice clips that play under the montage."
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

        <CustomizerSection
          title="Photos & videos"
          description="Visual moments to mix into the montage."
          badge={`${mediaIds.length} selected`}
        >
          <MediaPicker
            eventId={eventId}
            type="all"
            selectedIds={mediaIds}
            onToggle={toggleMedia}
            emptyHint="No photos or videos yet."
          />
        </CustomizerSection>
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        customization={customization}
        isReady={isReady}
        notReadyMessage="Pick at least one audio message or media item."
        requiresShipping={false}
      />
    </div>
  );
};
