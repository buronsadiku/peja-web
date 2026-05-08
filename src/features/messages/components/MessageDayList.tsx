"use client";

import type { MessageRowView } from "../adapters";
import { MessageDayHeader } from "./MessageDayHeader";
import { MessageDayListFooter } from "./MessageDayListFooter";
import { MessageRow } from "./MessageRow";

type MessageDayListProps = {
  messages: MessageRowView[];
  selectedIds: Set<string>;
  activeMessageId: string | null;
  playingId: string | null;
  isPlaying?: boolean;
  playingProgress?: number;
  playingDuration?: number;
  playingCurrentTime?: number;
  onRowClick: (id: string) => void;
  onRowPlay?: (id: string) => void;
  onRowToggleSelect?: (id: string) => void;
};

const groupLabel = (createdAt: string): string => {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "Earlier";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const groupMessages = (messages: MessageRowView[]) => {
  const groups: { label: string; items: MessageRowView[] }[] = [];
  for (const m of messages) {
    const label = groupLabel(m.createdAt);
    const existing = groups.find((g) => g.label === label);
    if (existing) existing.items.push(m);
    else groups.push({ label, items: [m] });
  }
  return groups;
};

export const MessageDayList = ({
  messages,
  selectedIds,
  activeMessageId,
  playingId,
  isPlaying = false,
  playingProgress = 0,
  playingDuration = 0,
  playingCurrentTime = 0,
  onRowClick,
  onRowPlay,
  onRowToggleSelect,
}: MessageDayListProps) => {
  const groups = groupMessages(messages);
  const groupOffsets = groups.reduce<number[]>((acc, group, idx) => {
    const prev = idx === 0 ? 0 : acc[idx - 1] + groups[idx - 1].items.length;
    return [...acc, prev];
  }, []);
  const isHighlighted = (id: string) => id === activeMessageId;

  return (
    <div>
      {groups.map((group, groupIdx) => (
        <section key={group.label}>
          <MessageDayHeader
            day={group.label}
            date=""
            count={group.items.length}
          />
          {group.items.map((message, itemIdx) => (
            <MessageRow
              key={message.id}
              message={message}
              selected={isHighlighted(message.id)}
              checked={selectedIds.has(message.id)}
              isCurrent={message.id === playingId}
              playing={message.id === playingId && isPlaying}
              progress={message.id === playingId ? playingProgress : 0}
              currentTime={message.id === playingId ? playingCurrentTime : 0}
              durationOverride={
                message.id === playingId && playingDuration > 0
                  ? playingDuration
                  : undefined
              }
              index={groupOffsets[groupIdx] + itemIdx}
              onClick={() => onRowClick(message.id)}
              onPlay={onRowPlay ? () => onRowPlay(message.id) : undefined}
              onToggleSelect={
                onRowToggleSelect
                  ? () => onRowToggleSelect(message.id)
                  : undefined
              }
            />
          ))}
        </section>
      ))}
      <MessageDayListFooter />
    </div>
  );
};
