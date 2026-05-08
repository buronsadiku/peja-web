"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { messagesClient } from "@/lib/api/messages-client";
import { ApiError } from "@/lib/api/client";
import { Checkbox } from "@peja/ui/components/Checkbox";
import { AudioMessageRow } from "./AudioMessageRow";
import { PickerSkeleton } from "./PickerSkeleton";
import { SourceFilterTabs, type SourceFilter } from "./SourceFilterTabs";
import type { ListMessagesQuery, MessageSummary } from "@/lib/api/types";

type AudioMessagePickerProps = {
  eventId: string | null;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  emptyHint: string;
};

export const AudioMessagePicker = ({
  eventId,
  selectedIds,
  onToggle,
  onSelectAll,
  emptyHint,
}: AudioMessagePickerProps) => {
  const [source, setSource] = useState<SourceFilter>("all");
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!eventId) return;
    const reqId = ++requestIdRef.current;
    setRefreshing(true);
    setError(null);
    const query: ListMessagesQuery = {
      limit: 100,
      sort: "newest",
      filter: source === "favorites" ? "favorites" : "all",
    };
    messagesClient
      .list(eventId, query)
      .then((result) => {
        if (reqId !== requestIdRef.current) return;
        const audios = result.items.filter((item) => item.hasAudio);
        const filtered =
          source === "gold_book"
            ? audios.filter((m) => m.isGoldBookSelected)
            : audios;
        setMessages(filtered);
        setHasLoadedOnce(true);
      })
      .catch((err) => {
        if (reqId !== requestIdRef.current) return;
        setError(
          ApiError.isApiError(err) ? err.message : "Could not load messages",
        );
      })
      .finally(() => {
        if (reqId === requestIdRef.current) setRefreshing(false);
      });
  }, [eventId, source]);

  const allIds = useMemo(() => messages.map((m) => m.id), [messages]);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  if (!eventId) return null;

  const showInitialLoading = !hasLoadedOnce && refreshing;
  const showEmpty = hasLoadedOnce && !error && messages.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <SourceFilterTabs value={source} onChange={setSource} />
        {refreshing && hasLoadedOnce && (
          <span
            className="type-caption text-muted-foreground tracking-wider"
            role="status"
          >
            Updating…
          </span>
        )}
      </div>
      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}
      {showInitialLoading && <PickerSkeleton variant="rows" count={6} />}
      {showEmpty && (
        <p className="type-body-small text-muted-foreground">{emptyHint}</p>
      )}
      {messages.length > 0 && (
        <>
          <label className="type-caption text-muted-foreground inline-flex items-center gap-2 self-start tracking-wider">
            <Checkbox
              checked={allSelected}
              onChange={(checked) => onSelectAll(checked ? allIds : [])}
            />
            Select all ({messages.length})
          </label>
          <div
            className={`rounded-12 border-border bg-card flex flex-col divide-y divide-(--border) overflow-hidden border transition-opacity ${
              refreshing ? "opacity-60" : "opacity-100"
            }`}
          >
            {messages.map((message) => (
              <AudioMessageRow
                key={message.id}
                message={message}
                selected={selectedIds.includes(message.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
