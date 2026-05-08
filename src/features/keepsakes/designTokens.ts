import type { KeepsakeProduct } from "@/lib/api/types";

export type KeepsakeDesign = {
  subtitleKey: string;
  headlineKey: string;
  taglineKey: string;
  gradient: string;
  dark?: boolean;
  featured?: boolean;
};

const FALLBACK: KeepsakeDesign = {
  subtitleKey: "keepsakes__design__fallback__subtitle",
  headlineKey: "keepsakes__design__fallback__headline",
  taglineKey: "keepsakes__design__fallback__tagline",
  gradient: "linear-gradient(135deg, #EFC9A8, #D8B997)",
};

const DESIGN_BY_SKU: Record<string, KeepsakeDesign> = {
  gold_book: {
    subtitleKey: "keepsakes__design__gold_book__subtitle",
    headlineKey: "keepsakes__design__gold_book__headline",
    taglineKey: "keepsakes__design__gold_book__tagline",
    gradient: "linear-gradient(135deg, #F2D7B3, #C99A66)",
    featured: true,
  },
  video_montage: {
    subtitleKey: "keepsakes__design__video_montage__subtitle",
    headlineKey: "keepsakes__design__video_montage__headline",
    taglineKey: "keepsakes__design__video_montage__tagline",
    gradient: "linear-gradient(135deg, #9CB8EE, #5E86DC)",
  },
  audio_vinyl: {
    subtitleKey: "keepsakes__design__audio_vinyl__subtitle",
    headlineKey: "keepsakes__design__audio_vinyl__headline",
    taglineKey: "keepsakes__design__audio_vinyl__tagline",
    gradient: "linear-gradient(135deg, #4a4a4a, #1a1a1a)",
    dark: true,
  },
  digital_album: {
    subtitleKey: "keepsakes__design__digital_album__subtitle",
    headlineKey: "keepsakes__design__digital_album__headline",
    taglineKey: "keepsakes__design__digital_album__tagline",
    gradient: "linear-gradient(135deg, #BCEEC9, #5EC678)",
  },
  thank_you_cards: {
    subtitleKey: "keepsakes__design__thank_you_cards__subtitle",
    headlineKey: "keepsakes__design__thank_you_cards__headline",
    taglineKey: "keepsakes__design__thank_you_cards__tagline",
    gradient: "linear-gradient(135deg, #F4B59C, #E27A58)",
  },
  canvas_print: {
    subtitleKey: "keepsakes__design__canvas_print__subtitle",
    headlineKey: "keepsakes__design__canvas_print__headline",
    taglineKey: "keepsakes__design__canvas_print__tagline",
    gradient: "linear-gradient(135deg, #F1D3D7, #D39BA3)",
  },
};

export const designFor = (sku: string): KeepsakeDesign =>
  DESIGN_BY_SKU[sku] ?? FALLBACK;

export type DesignedProduct = KeepsakeProduct & {
  design: KeepsakeDesign;
};

export const decorate = (product: KeepsakeProduct): DesignedProduct => ({
  ...product,
  design: designFor(product.sku),
});

export const formatPrice = (priceCents: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(0)} ${currency}`;
  }
};

export const formatTimeline = (days: string | null | undefined): string => {
  if (!days) return "";
  return `${days} days`;
};
