"use client";

import { Checkbox } from "@peja/ui/components/Checkbox";
import type { MessageSummary } from "@/lib/api/types";

type AudioMessageRowProps = {
  message: MessageSummary;
  selected: boolean;
  onToggle: (id: string) => void;
};

const formatDuration = (seconds: number | null) => {
  if (seconds == null) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export const AudioMessageRow = ({
  message,
  selected,
  onToggle,
}: AudioMessageRowProps) => {
  const duration = formatDuration(message.audioDurationSec);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(message.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(message.id);
        }
      }}
      className="hover:bg-muted/40 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
    >
      <Checkbox
        checked={selected}
        onChange={() => onToggle(message.id)}
      />
      <div className="flex flex-1 flex-col">
        <span className="type-body-small font-medium">
          {message.guestNames || "Guest"}
        </span>
        {message.transcriptSnippet && (
          <span className="type-caption text-muted-foreground line-clamp-1">
            {message.transcriptSnippet}
          </span>
        )}
      </div>
      {duration && (
        <span className="type-caption text-muted-foreground tracking-wider">
          {duration}
        </span>
      )}
    </div>
  );
};
