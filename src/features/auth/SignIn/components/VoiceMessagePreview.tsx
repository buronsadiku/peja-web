import { VoiceWaveformBar } from "./VoiceWaveformBar";

type VoiceMessagePreviewProps = {
  name: string;
  role: string;
  duration: string;
  initial: string;
  tint: string;
};

const HEIGHTS = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.3];

export const VoiceMessagePreview = ({
  name,
  role,
  duration,
  initial,
  tint,
}: VoiceMessagePreviewProps) => (
  <div className="inline-flex items-center gap-3 rounded-full bg-white/12 px-2.5 py-2.5 pr-4 backdrop-blur-sm">
    <div
      className="flex size-9 items-center justify-center rounded-full font-serif font-bold"
      style={{ background: tint, color: "#5a3b20" }}
    >
      {initial}
    </div>
    <div>
      <p className="type-body-small font-semibold">{name}</p>
      <p className="type-caption opacity-70">
        {role} &middot; {duration}
      </p>
    </div>
    <div className="ml-2 flex items-center gap-0.5">
      {HEIGHTS.map((h, i) => (
        <VoiceWaveformBar key={i} height={h} />
      ))}
    </div>
  </div>
);
