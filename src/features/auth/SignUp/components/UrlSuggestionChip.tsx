"use client";

type UrlSuggestionChipProps = {
  slug: string;
  onClick?: () => void;
};

export const UrlSuggestionChip = ({
  slug,
  onClick,
}: UrlSuggestionChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className="border-border bg-card type-body-small text-foreground hover:bg-muted cursor-pointer rounded-full border px-3.5 py-2 font-mono transition-colors"
  >
    {slug}
  </button>
);
