"use client";

import { formatPrice } from "../designTokens";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type VariantSelectorProps = {
  label: string;
  variants: KeepsakeProductVariant[];
  basePriceCents: number;
  selectedId: string | null;
  onChange: (variantId: string) => void;
};

export const VariantSelector = ({
  label,
  variants,
  basePriceCents,
  selectedId,
  onChange,
}: VariantSelectorProps) => {
  if (variants.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="type-caption text-muted-foreground tracking-wider">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const priceCents = variant.priceCents ?? basePriceCents;
          const active = selectedId === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onChange(variant.id)}
              className={`rounded-12 flex flex-col gap-0.5 border px-4 py-2 text-left transition ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-foreground/20"
              }`}
            >
              <span className="type-body-small font-medium">
                {variant.name}
              </span>
              <span className="type-caption text-muted-foreground">
                {formatPrice(priceCents, variant.currency)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
