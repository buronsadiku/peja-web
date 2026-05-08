export const STEP_COLORS: Record<number, string> = {
  1: "text-primary",
  2: "text-destructive",
  3: "text-secondary",
};

export const QR_CARDS: Array<{ rotation: number; translateX: number }> = [
  { rotation: -6, translateX: -18 },
  { rotation: 0, translateX: 0 },
  { rotation: 6, translateX: 18 },
];

export const WAVEFORM_HEIGHTS = [
  8, 14, 20, 28, 36, 44, 36, 28, 44, 36, 20, 28, 36, 44, 36, 28, 20, 14, 28, 36,
  20, 12,
];

export const MINI_WAVEFORM_HEIGHTS = [4, 8, 12, 8, 16, 10, 6, 14, 8, 12, 6, 10];
