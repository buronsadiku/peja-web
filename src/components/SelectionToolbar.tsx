"use client";

import { Button } from "@peja/ui/components/Button";

type SelectionToolbarProps = {
  selectMode: boolean;
  count: number;
  onToggle: () => void;
  onClearAll: () => void;
};

export const SelectionToolbar = ({
  selectMode,
  count,
  onToggle,
  onClearAll,
}: SelectionToolbarProps) => (
  <div className="border-border tablet:px-7 flex items-center gap-2 border-b px-4 py-2.5">
    <Button
      variant={selectMode ? "default" : "outline"}
      size="sm"
      onClick={onToggle}
      className="rounded-full"
    >
      {selectMode ? `Cancel (${count})` : "Select"}
    </Button>
    {selectMode && count > 0 && (
      <button
        type="button"
        onClick={onClearAll}
        className="type-caption text-primary cursor-pointer font-semibold"
      >
        Clear all
      </button>
    )}
  </div>
);
