"use client";

import { cn } from "@peja/ui/utils/cn";
import { PlusIcon } from "@peja/icons/PlusIcon";
import { CoverSelectedBadge } from "./CoverSelectedBadge";

type CoverOptionProps = {
  label: string;
  tint: string;
  selected?: boolean;
  isUpload?: boolean;
  initials?: string;
  onClick?: () => void;
};

export const CoverOption = ({
  label,
  tint,
  selected = false,
  isUpload = false,
  initials,
  onClick,
}: CoverOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-16 relative aspect-square cursor-pointer overflow-hidden",
      selected
        ? "border-primary shadow-primary/25 ring-primary/10 border-[3px] shadow-lg ring-4"
        : "border-border border shadow-sm",
    )}
  >
    <div
      className="flex size-full items-center justify-center"
      style={
        isUpload
          ? undefined
          : {
              background: `repeating-linear-gradient(135deg, ${tint} 0 8px, color-mix(in oklch, ${tint}, #000 10%) 8px 16px)`,
            }
      }
    >
      {isUpload ? (
        <PlusIcon
          width={28}
          height={28}
          className="text-primary"
          strokeWidth={1.8}
        />
      ) : (
        <span className="type-h3 text-black/40 italic">
          {initials}
        </span>
      )}
    </div>
    {selected && <CoverSelectedBadge />}
    <span className="type-caption absolute right-2 bottom-2 left-2 font-semibold text-white drop-shadow-sm">
      {label}
    </span>
  </button>
);
