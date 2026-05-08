type VoiceWaveformBarProps = {
  height: number;
};

export const VoiceWaveformBar = ({ height }: VoiceWaveformBarProps) => (
  <span
    className="w-[3px] rounded-full bg-white"
    style={{ height: `${height * 22}px` }}
  />
);
