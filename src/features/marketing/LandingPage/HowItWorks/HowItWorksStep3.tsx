import { PlayIcon } from "@peja/icons/PlayIcon";
import { HowItWorksWaveformBar } from "./HowItWorksWaveformBar";
import { MINI_WAVEFORM_HEIGHTS } from "./constants";

type HowItWorksStep3Props = {
  quoteText: string;
  timeLabel: string;
};

export const HowItWorksStep3 = ({
  quoteText,
  timeLabel,
}: HowItWorksStep3Props) => (
  <div className="flex h-40 items-center justify-center">
    <div className="border-border bg-card flex h-37.5 w-55 flex-col justify-between rounded-xl border p-4 shadow-lg">
      <span className="text-muted-foreground type-overline font-medium">
        {timeLabel}
      </span>
      <p className="text-foreground type-caption line-clamp-3 font-serif leading-snug italic">
        {quoteText}
      </p>
      <div className="flex items-center gap-2">
        <div className="bg-secondary flex size-6 shrink-0 items-center justify-center rounded-full">
          <PlayIcon className="text-secondary-foreground" width={10} height={10} />
        </div>
        <div className="flex h-4 items-end gap-0.5">
          {MINI_WAVEFORM_HEIGHTS.map((h, i) => (
            <HowItWorksWaveformBar key={i} height={h} variant="mini" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
