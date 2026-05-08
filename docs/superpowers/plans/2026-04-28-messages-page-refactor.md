# Messages Page Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `MessagesPageClient.tsx` into a thin composition over a Zustand store + focused hooks + connected components, share the `<audio>` plumbing via `@peja/ui`, and apply the same shape to `MessageDetailPageClient.tsx`.

**Architecture:** Feature-scoped Zustand store owns `filter`, `selectedIds`, and `activeMessageId`. Hooks under `src/features/messages/hooks/` encapsulate query/mutation/effect logic. `Connected*` components bridge store ↔ existing presentational components (which stay prop-driven). A presentational `<AudioElement>` and a domain-agnostic `useHtmlAudioPlayer` move into `@peja/ui` for reuse.

**Tech Stack:** Next.js 16, React 19, Zustand 5, TanStack Query 5, next-intl 4, Tailwind v4, TypeScript.

**Verification stack (this repo has no test runner for this feature):**
- `pnpm ts-check` — TypeScript must pass with zero errors after every change.
- `pnpm lint` — ESLint must pass.
- `pnpm format` — Prettier formatting before each commit.
- Manual smoke on `pnpm dev` at the end (golden path + edge cases listed in Task 21).

**Reference design spec:** `docs/superpowers/specs/2026-04-28-messages-page-refactor-design.md`

**Conventions enforced throughout:**
- `'use client'` on every file that uses hooks / store / context.
- Arrow-function components only.
- One component per file.
- Imports from `@/i18n/navigation`, never `next/link` / `next/navigation`.
- No raw Tailwind colors / sizes / radii / shadows.
- No code comments.
- Commits: Conventional Commits, no AI/Claude attribution.

---

## Task 1: Add `AudioElement` to `@peja/ui`

**Files:**
- Create: `packages/ui/src/components/AudioElement.tsx`

- [ ] **Step 1: Create the AudioElement component**

Write `packages/ui/src/components/AudioElement.tsx`:

```tsx
import { forwardRef } from "react";
import { cn } from "../utils/cn";

type AudioElementProps = Omit<React.ComponentProps<"audio">, "controls">;

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  ({ className, ...rest }, ref) => (
    <audio ref={ref} className={cn("hidden", className)} {...rest} />
  ),
);

AudioElement.displayName = "AudioElement";
```

- [ ] **Step 2: Type-check**

Run: `pnpm ts-check`
Expected: PASS with zero errors.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/AudioElement.tsx
git commit -m "feat(ui): add AudioElement primitive"
```

---

## Task 2: Add `useHtmlAudioPlayer` to `@peja/ui`

**Files:**
- Create: `packages/ui/src/hooks/useHtmlAudioPlayer.ts`

- [ ] **Step 1: Create the hook**

Write `packages/ui/src/hooks/useHtmlAudioPlayer.ts`:

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlayerState = {
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};

const initialState: PlayerState = {
  playingId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

type UseHtmlAudioPlayerOptions = {
  resolveSrc: (id: string) => Promise<string | null>;
};

export type HtmlAudioPlayer = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioProps: {
    onPlay: () => void;
    onPause: () => void;
    onTimeUpdate: () => void;
    onLoadedMetadata: () => void;
    onDurationChange: () => void;
    onEnded: () => void;
  };
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  toggle: (id: string) => Promise<void>;
  seekRatio: (ratio: number) => void;
};

export const useHtmlAudioPlayer = (
  options: UseHtmlAudioPlayerOptions,
): HtmlAudioPlayer => {
  const { resolveSrc } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(initialState);

  const toggle = useCallback(
    async (id: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (state.playingId === id) {
        if (audio.paused) {
          await audio.play().catch((err) => {
            console.error("[audio] play failed", err);
          });
        } else {
          audio.pause();
        }
        return;
      }

      const url = await resolveSrc(id);
      if (!url) return;
      audio.src = url;
      setState({ playingId: id, isPlaying: false, currentTime: 0, duration: 0 });
      await audio.play().catch((err) => {
        console.error("[audio] play failed", err);
      });
    },
    [resolveSrc, state.playingId],
  );

  const handlePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: true }));
  }, []);
  const handlePause = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState((s) => ({
      ...s,
      currentTime: audio.currentTime,
      duration: Number.isFinite(audio.duration) ? audio.duration : s.duration,
    }));
  }, []);
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState((s) => ({
      ...s,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    }));
  }, []);
  const handleDurationChange = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!Number.isFinite(audio.duration)) return;
    setState((s) => ({ ...s, duration: audio.duration }));
  }, []);
  const handleEnded = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }));
  }, []);

  const seekRatio = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    audio.currentTime = clamped * duration;
    setState((s) => ({ ...s, currentTime: audio.currentTime }));
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const progress =
    state.duration > 0
      ? Math.min(1, Math.max(0, state.currentTime / state.duration))
      : 0;

  return {
    audioRef,
    audioProps: {
      onPlay: handlePlay,
      onPause: handlePause,
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata,
      onDurationChange: handleDurationChange,
      onEnded: handleEnded,
    },
    playingId: state.playingId,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    progress,
    toggle,
    seekRatio,
  };
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/hooks/useHtmlAudioPlayer.ts
git commit -m "feat(ui): add useHtmlAudioPlayer hook"
```

---

## Task 3: Convert `useMessageAudioPlayer` to a thin wrapper

**Files:**
- Modify: `src/features/messages/useMessageAudioPlayer.ts` (full rewrite)

The existing file lives at the feature root; per the design spec the new home is `src/features/messages/hooks/useMessageAudioPlayer.ts`. We move it in this task.

- [ ] **Step 1: Create new location with thin wrapper**

Create directory if missing, then write `src/features/messages/hooks/useMessageAudioPlayer.ts`:

```ts
"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useHtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import { messagesClient } from "@/lib/api/messages-client";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";

export const useMessageAudioPlayer = (eventId: string) => {
  const qc = useQueryClient();

  const resolveSrc = useCallback(
    async (id: string): Promise<string | null> => {
      const key = queryKeys.messages.detail(eventId, id);
      const cached = qc.getQueryData<{ message: MessageDetail }>(key);
      if (cached?.message.audioUrl) return cached.message.audioUrl;
      const fetched = await qc.fetchQuery<{ message: MessageDetail }>({
        queryKey: key,
        queryFn: () => messagesClient.get(eventId, id),
      });
      return fetched.message.audioUrl;
    },
    [eventId, qc],
  );

  return useHtmlAudioPlayer({ resolveSrc });
};
```

- [ ] **Step 2: Delete the old file**

Run: `rm src/features/messages/useMessageAudioPlayer.ts`

- [ ] **Step 3: Update both consumers' imports**

In `src/features/messages/MessagesPageClient.tsx` change:
```ts
import { useMessageAudioPlayer } from "./useMessageAudioPlayer";
```
to:
```ts
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
```

Apply the identical change in `src/features/messages/MessageDetailPageClient.tsx`.

- [ ] **Step 4: Update both call sites to use `audioProps`**

In `MessagesPageClient.tsx`, replace the `<audio>` JSX block:

```tsx
<audio
  ref={player.audioRef}
  onPlay={player.handlePlay}
  onPause={player.handlePause}
  onTimeUpdate={player.handleTimeUpdate}
  onLoadedMetadata={player.handleLoadedMetadata}
  onDurationChange={player.handleDurationChange}
  onEnded={player.handleEnded}
  className="hidden"
/>
```

with:

```tsx
<audio ref={player.audioRef} {...player.audioProps} className="hidden" />
```

Apply the identical change in `MessageDetailPageClient.tsx`.

- [ ] **Step 5: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS. The page still renders identically — we've only moved code.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(messages): move audio player to shared @peja/ui hook"
```

---

## Task 4: Create the Zustand store

**Files:**
- Create: `src/features/messages/store/useMessagesStore.ts`

- [ ] **Step 1: Create the store**

Write `src/features/messages/store/useMessagesStore.ts`:

```ts
"use client";

import { create } from "zustand";
import type { MessageFilter } from "@/lib/api/types";

type MessagesState = {
  filter: MessageFilter;
  selectedIds: Set<string>;
  activeMessageId: string | null;
  setFilter: (filter: MessageFilter) => void;
  toggleSelected: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setActiveMessageId: (id: string | null) => void;
  toggleActiveMessageId: (id: string) => void;
  reset: () => void;
};

const initial = {
  filter: "all" as MessageFilter,
  selectedIds: new Set<string>(),
  activeMessageId: null as string | null,
};

export const useMessagesStore = create<MessagesState>((set) => ({
  ...initial,
  setFilter: (filter) =>
    set({ filter, selectedIds: new Set(), activeMessageId: null }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
  setActiveMessageId: (id) => set({ activeMessageId: id }),
  toggleActiveMessageId: (id) =>
    set((s) => ({ activeMessageId: s.activeMessageId === id ? null : id })),
  reset: () => set({ ...initial, selectedIds: new Set() }),
}));

export const useFilter = () => useMessagesStore((s) => s.filter);
export const useSelectedIds = () => useMessagesStore((s) => s.selectedIds);
export const useActiveMessageId = () =>
  useMessagesStore((s) => s.activeMessageId);
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/store/useMessagesStore.ts
git commit -m "feat(messages): add zustand store for filter/selection/active"
```

---

## Task 5: Create the event context

**Files:**
- Create: `src/features/messages/context/MessagesEventContext.tsx`

- [ ] **Step 1: Create the context provider + hook**

Write `src/features/messages/context/MessagesEventContext.tsx`:

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";

const MessagesEventContext = createContext<string | null>(null);

export const MessagesEventProvider = ({
  eventId,
  children,
}: {
  eventId: string;
  children: ReactNode;
}) => (
  <MessagesEventContext.Provider value={eventId}>
    {children}
  </MessagesEventContext.Provider>
);

export const useEventId = () => {
  const id = useContext(MessagesEventContext);
  if (!id)
    throw new Error("useEventId must be used inside MessagesEventProvider");
  return id;
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/context/MessagesEventContext.tsx
git commit -m "feat(messages): add MessagesEventProvider for eventId scoping"
```

---

## Task 6: Add `toMessageRowViewFromDetail` adapter

**Files:**
- Modify: `src/features/messages/adapters.ts`

- [ ] **Step 1: Inspect existing exports**

Run: `cat src/features/messages/adapters.ts | head -40`
Expected: see `toMessageRowView`, `initialsFrom`, `tintFrom`, `waveFrom`, `formatDurationShort`, `formatTimeShort` exports.

- [ ] **Step 2: Append adapter**

Add to the bottom of `src/features/messages/adapters.ts`:

```ts
import type { MessageDetail } from "@/lib/api/types";

export const toMessageRowViewFromDetail = (
  m: MessageDetail,
  anonymous: string,
): MessageRowView => ({
  id: m.id,
  name: m.guestNames || anonymous,
  relation: "",
  quote: m.transcript ? m.transcript.slice(0, 120) : "",
  initials: initialsFrom(m.guestNames),
  tint: tintFrom(m.id),
  duration: formatDurationShort(m.audioDurationSec),
  durationSec: m.audioDurationSec ?? 0,
  favorited: m.isFavorite,
  inGoldBook: m.isGoldBookSelected,
  hasAudio: Boolean(m.audioUrl),
  hasPhoto: Boolean(m.photoUrl),
  listens: 0,
  time: formatTimeShort(m.createdAt),
  createdAt: m.createdAt,
  wave: waveFrom(m.id),
});
```

If `MessageDetail` is already imported at the top of the file, do not add a duplicate import.

- [ ] **Step 3: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/features/messages/adapters.ts
git commit -m "refactor(messages): extract toMessageRowViewFromDetail adapter"
```

---

## Task 7: Create `useMessageList` hook

**Files:**
- Create: `src/features/messages/hooks/useMessageList.ts`

- [ ] **Step 1: Create the hook**

Write `src/features/messages/hooks/useMessageList.ts`:

```ts
"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMessagesList } from "@/lib/query/messagesQueries";
import type { ListMessagesQuery } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";
import { useFilter } from "../store/useMessagesStore";
import { toMessageRowView } from "../adapters";

export const useMessageList = () => {
  const eventId = useEventId();
  const filter = useFilter();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const query: ListMessagesQuery = { filter, sort: "newest", limit: 50 };
  const { data, isPending, isError } = useMessagesList(eventId, query);

  const messageViews = useMemo(
    () => (data?.items ?? []).map((m) => toMessageRowView(m, anonymous)),
    [data?.items, anonymous],
  );

  return { messageViews, isPending, isError };
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/hooks/useMessageList.ts
git commit -m "feat(messages): add useMessageList hook"
```

---

## Task 8: Create `useMessageActions` hook

**Files:**
- Create: `src/features/messages/hooks/useMessageActions.ts`

- [ ] **Step 1: Create the hook**

Write `src/features/messages/hooks/useMessageActions.ts`:

```ts
"use client";

import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";
import { useActiveMessageId } from "../store/useMessagesStore";
import { useMessageList } from "./useMessageList";
import { toMessageRowViewFromDetail } from "../adapters";

export const useMessageActions = () => {
  const eventId = useEventId();
  const activeId = useActiveMessageId();
  const { messageViews } = useMessageList();
  const updateMessage = useUpdateMessage(eventId);
  const qc = useQueryClient();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const fromList = activeId
    ? (messageViews.find((m) => m.id === activeId) ?? null)
    : null;

  const cachedDetail = activeId
    ? qc.getQueryData<{ message: MessageDetail }>(
        queryKeys.messages.detail(eventId, activeId),
      )
    : null;

  const fromCache =
    !fromList && cachedDetail
      ? toMessageRowViewFromDetail(cachedDetail.message, anonymous)
      : null;

  const activeMessage = fromList ?? fromCache ?? null;

  const toggleFavorite = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isFavorite: !activeMessage.favorited },
    });
  };

  const toggleGoldBook = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isGoldBookSelected: !activeMessage.inGoldBook },
    });
  };

  return {
    activeMessage,
    toggleFavorite,
    toggleGoldBook,
    isPending: updateMessage.isPending,
  };
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/hooks/useMessageActions.ts
git commit -m "feat(messages): add useMessageActions hook"
```

---

## Task 9: Create `useMessageBulkActions` hook

**Files:**
- Create: `src/features/messages/hooks/useMessageBulkActions.ts`

- [ ] **Step 1: Create the hook**

Write `src/features/messages/hooks/useMessageBulkActions.ts`:

```ts
"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import { messagesClient } from "@/lib/api/messages-client";
import { downloadManyMessages } from "@/lib/media/downloadMessageAssets";
import type { MessageDetail } from "@/lib/api/types";
import { useEventId } from "../context/MessagesEventContext";
import { useSelectedIds } from "../store/useMessagesStore";
import { useMessageList } from "./useMessageList";

type BulkInput =
  | { kind: "favorite"; ids: string[]; nextValue: boolean }
  | { kind: "goldbook"; ids: string[]; nextValue: boolean }
  | { kind: "download"; ids: string[] };

export const useMessageBulkActions = () => {
  const eventId = useEventId();
  const qc = useQueryClient();
  const { messageViews } = useMessageList();
  const selectedIds = useSelectedIds();
  const updateMessage = useUpdateMessage(eventId);
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const selectedViews = useMemo(
    () => messageViews.filter((m) => selectedIds.has(m.id)),
    [messageViews, selectedIds],
  );

  const allFavorited =
    selectedViews.length > 0 && selectedViews.every((m) => m.favorited);
  const allInGoldBook =
    selectedViews.length > 0 && selectedViews.every((m) => m.inGoldBook);
  const selectedDurationSec = selectedViews.reduce(
    (acc, m) => acc + m.durationSec,
    0,
  );

  const mutation = useMutation({
    mutationFn: async (input: BulkInput) => {
      if (input.kind === "favorite") {
        await Promise.all(
          input.ids.map((id) =>
            updateMessage.mutateAsync({
              messageId: id,
              input: { isFavorite: input.nextValue },
            }),
          ),
        );
        return;
      }
      if (input.kind === "goldbook") {
        await Promise.all(
          input.ids.map((id) =>
            updateMessage.mutateAsync({
              messageId: id,
              input: { isGoldBookSelected: input.nextValue },
            }),
          ),
        );
        return;
      }
      const inputs = await Promise.all(
        input.ids.map(async (id) => {
          const detailKey = queryKeys.messages.detail(eventId, id);
          const cached =
            qc.getQueryData<{ message: MessageDetail }>(detailKey) ??
            (await qc.fetchQuery<{ message: MessageDetail }>({
              queryKey: detailKey,
              queryFn: () => messagesClient.get(eventId, id),
            }));
          return {
            guestName: cached.message.guestNames || anonymous,
            audioUrl: cached.message.audioUrl,
            videoUrl: cached.message.videoUrl,
            photoUrl: cached.message.photoUrl,
            writtenNote: cached.message.writtenNote,
          };
        }),
      );
      await downloadManyMessages(inputs, "messages");
    },
  });

  const ids = Array.from(selectedIds);

  return {
    bulkFavorite: () =>
      mutation.mutate({ kind: "favorite", ids, nextValue: !allFavorited }),
    bulkAddToGoldBook: () =>
      mutation.mutate({ kind: "goldbook", ids, nextValue: !allInGoldBook }),
    bulkDownload: () => mutation.mutate({ kind: "download", ids }),
    isPending: mutation.isPending,
    allFavorited,
    allInGoldBook,
    selectedCount: selectedIds.size,
    selectedDurationSec,
  };
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/hooks/useMessageBulkActions.ts
git commit -m "feat(messages): add useMessageBulkActions hook"
```

---

## Task 10: Create `useAudioDurationSync` hook

**Files:**
- Create: `src/features/messages/hooks/useAudioDurationSync.ts`

- [ ] **Step 1: Create the hook**

Write `src/features/messages/hooks/useAudioDurationSync.ts`:

```ts
"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";
import type { HtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import { useEventId } from "../context/MessagesEventContext";

export const useAudioDurationSync = (player: HtmlAudioPlayer) => {
  const eventId = useEventId();
  const qc = useQueryClient();
  const updateMessage = useUpdateMessage(eventId);
  const syncedDurationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = player.playingId;
    const measured = player.duration;
    if (!id || !Number.isFinite(measured) || measured <= 0) return;
    if (syncedDurationsRef.current.has(id)) return;
    const detail = qc.getQueryData<{ message: MessageDetail }>(
      queryKeys.messages.detail(eventId, id),
    );
    const stored = detail?.message.audioDurationSec ?? null;
    const rounded = Math.round(measured);
    if (stored === rounded) {
      syncedDurationsRef.current.add(id);
      return;
    }
    syncedDurationsRef.current.add(id);
    updateMessage.mutate({
      messageId: id,
      input: { audioDurationSec: rounded },
    });
  }, [player.playingId, player.duration, eventId, qc, updateMessage]);
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/hooks/useAudioDurationSync.ts
git commit -m "feat(messages): add useAudioDurationSync hook"
```

---

## Task 11: Create `useResponsiveRowOpen` hook

**Files:**
- Create: `src/features/messages/hooks/useResponsiveRowOpen.ts`

- [ ] **Step 1: Create the hook**

Write `src/features/messages/hooks/useResponsiveRowOpen.ts`:

```ts
"use client";

import type { HtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import { useRouter } from "@/i18n/navigation";
import { useMessagesStore } from "../store/useMessagesStore";

const isBelowSmallDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 1023.98px)").matches;

export const useResponsiveRowOpen = (player: HtmlAudioPlayer) => {
  const router = useRouter();
  const toggleActiveMessageId = useMessagesStore(
    (s) => s.toggleActiveMessageId,
  );
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);

  const openRow = (id: string) => {
    if (isBelowSmallDesktop()) {
      router.push(`/app/messages/${id}`);
      return;
    }
    toggleActiveMessageId(id);
  };

  const playRow = (id: string) => {
    setActiveMessageId(id);
    void player.toggle(id);
  };

  return { openRow, playRow };
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/hooks/useResponsiveRowOpen.ts
git commit -m "feat(messages): add useResponsiveRowOpen hook"
```

---

## Task 12: Create `useDetailMessageActiveSync` hook

**Files:**
- Create: `src/features/messages/hooks/useDetailMessageActiveSync.ts`

- [ ] **Step 1: Create the hook**

Write `src/features/messages/hooks/useDetailMessageActiveSync.ts`:

```ts
"use client";

import { useEffect } from "react";
import { useMessagesStore } from "../store/useMessagesStore";

export const useDetailMessageActiveSync = (messageId: string) => {
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);

  useEffect(() => {
    setActiveMessageId(messageId);
    return () => setActiveMessageId(null);
  }, [messageId, setActiveMessageId]);
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/hooks/useDetailMessageActiveSync.ts
git commit -m "feat(messages): add useDetailMessageActiveSync hook"
```

---

## Task 13: Create `MessagesStoreReset` component

**Files:**
- Create: `src/features/messages/components/MessagesStoreReset.tsx`

- [ ] **Step 1: Create the component**

Write `src/features/messages/components/MessagesStoreReset.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useMessagesStore } from "../store/useMessagesStore";

export const MessagesStoreReset = () => {
  const reset = useMessagesStore((s) => s.reset);

  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  return null;
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/components/MessagesStoreReset.tsx
git commit -m "feat(messages): add MessagesStoreReset for page lifecycle"
```

---

## Task 14: Create `MessagesFilterRail` component

**Files:**
- Create: `src/features/messages/components/MessagesFilterRail.tsx`

- [ ] **Step 1: Create the component**

Write `src/features/messages/components/MessagesFilterRail.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@peja/ui/components/Checkbox";
import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import type { MessageFilter } from "@/lib/api/types";
import {
  useFilter,
  useMessagesStore,
  useSelectedIds,
} from "../store/useMessagesStore";
import { useMessageList } from "../hooks/useMessageList";

const FILTER_VALUES: { labelKey: string; value: MessageFilter }[] = [
  { labelKey: "messages__filter__all", value: "all" },
  { labelKey: "messages__filter__favourites", value: "favorites" },
  { labelKey: "messages__filter__with_photo", value: "with_photo" },
  { labelKey: "messages__filter__with_video", value: "with_video" },
  { labelKey: "messages__filter__audio_only", value: "audio_only" },
];

export const MessagesFilterRail = () => {
  const t = useTranslations();
  const filter = useFilter();
  const setFilter = useMessagesStore((s) => s.setFilter);
  const selectAll = useMessagesStore((s) => s.selectAll);
  const clearSelection = useMessagesStore((s) => s.clearSelection);
  const selectedIds = useSelectedIds();
  const { messageViews } = useMessageList();

  const filterChips = FILTER_VALUES.map((c) => ({
    label: t(c.labelKey),
    value: c.value,
  }));

  const chipItems: FilterChipItem[] = filterChips.map((c) => ({
    label: c.label,
    count:
      c.value === "all"
        ? messageViews.length
        : c.value === "favorites" && filter === "favorites"
          ? messageViews.length
          : undefined,
  }));

  const activeChipLabel =
    filterChips.find((c) => c.value === filter)?.label ?? filterChips[0].label;

  const handleChipSelect = (label: string) => {
    const next = filterChips.find((c) => c.label === label);
    if (next) setFilter(next.value);
  };

  const allSelected =
    messageViews.length > 0 &&
    messageViews.every((m) => selectedIds.has(m.id));

  const handleToggleAll = () => {
    if (allSelected) clearSelection();
    else selectAll(messageViews.map((m) => m.id));
  };

  return (
    <FilterChipRail
      chips={chipItems}
      activeLabel={activeChipLabel}
      onSelect={handleChipSelect}
      leading={
        <Checkbox
          checked={allSelected}
          onChange={handleToggleAll}
          aria-label={t("messages__select_all")}
          className="mr-1 ml-2.5"
        />
      }
    />
  );
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/components/MessagesFilterRail.tsx
git commit -m "feat(messages): add MessagesFilterRail self-contained component"
```

---

## Task 15: Create `ConnectedMessageDayList` component

**Files:**
- Create: `src/features/messages/components/ConnectedMessageDayList.tsx`

- [ ] **Step 1: Create the component**

Write `src/features/messages/components/ConnectedMessageDayList.tsx`:

```tsx
"use client";

import type { HtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import {
  useActiveMessageId,
  useMessagesStore,
  useSelectedIds,
} from "../store/useMessagesStore";
import { useMessageList } from "../hooks/useMessageList";
import { useResponsiveRowOpen } from "../hooks/useResponsiveRowOpen";
import { MessageDayList } from "./MessageDayList";

type Props = {
  player: HtmlAudioPlayer;
};

export const ConnectedMessageDayList = ({ player }: Props) => {
  const { messageViews } = useMessageList();
  const selectedIds = useSelectedIds();
  const activeMessageId = useActiveMessageId();
  const toggleSelected = useMessagesStore((s) => s.toggleSelected);
  const { openRow, playRow } = useResponsiveRowOpen(player);

  return (
    <MessageDayList
      messages={messageViews}
      selectedIds={selectedIds}
      activeMessageId={activeMessageId}
      playingId={player.playingId}
      isPlaying={player.isPlaying}
      playingProgress={player.progress}
      playingDuration={player.duration}
      playingCurrentTime={player.currentTime}
      onRowClick={openRow}
      onRowPlay={playRow}
      onRowToggleSelect={toggleSelected}
    />
  );
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/components/ConnectedMessageDayList.tsx
git commit -m "feat(messages): add ConnectedMessageDayList wrapper"
```

---

## Task 16: Create `MessagesListBody` component

**Files:**
- Create: `src/features/messages/components/MessagesListBody.tsx`

- [ ] **Step 1: Create the component**

Write `src/features/messages/components/MessagesListBody.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import type { HtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import { useMessageList } from "../hooks/useMessageList";
import { ConnectedMessageDayList } from "./ConnectedMessageDayList";

type Props = {
  player: HtmlAudioPlayer;
};

export const MessagesListBody = ({ player }: Props) => {
  const t = useTranslations();
  const { messageViews, isPending, isError } = useMessageList();

  if (isPending) {
    return (
      <p className="type-body-small text-muted-foreground p-8 text-center">
        {t("messages__loading")}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="type-body-small text-destructive p-8 text-center">
        {t("messages__error")}
      </p>
    );
  }

  if (messageViews.length === 0) {
    return (
      <p className="type-body-small text-muted-foreground p-8 text-center">
        {t("messages__no_match")}
      </p>
    );
  }

  return <ConnectedMessageDayList player={player} />;
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/components/MessagesListBody.tsx
git commit -m "feat(messages): add MessagesListBody status switch"
```

---

## Task 17: Create `ConnectedBatchFooter` component

**Files:**
- Create: `src/features/messages/components/ConnectedBatchFooter.tsx`

- [ ] **Step 1: Create the component**

Write `src/features/messages/components/ConnectedBatchFooter.tsx`:

```tsx
"use client";

import { useMessageBulkActions } from "../hooks/useMessageBulkActions";
import { formatDurationLong } from "../utils";
import { MessageBatchFooter } from "./MessageBatchFooter";

export const ConnectedBatchFooter = () => {
  const {
    bulkFavorite,
    bulkAddToGoldBook,
    bulkDownload,
    isPending,
    allFavorited,
    allInGoldBook,
    selectedCount,
    selectedDurationSec,
  } = useMessageBulkActions();

  return (
    <MessageBatchFooter
      count={selectedCount}
      combinedDuration={formatDurationLong(selectedDurationSec)}
      onBulkFavorite={bulkFavorite}
      onBulkDownload={bulkDownload}
      onBulkAddToGoldBook={bulkAddToGoldBook}
      bulkPending={isPending}
      allFavorited={allFavorited}
      allInGoldBook={allInGoldBook}
    />
  );
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/components/ConnectedBatchFooter.tsx
git commit -m "feat(messages): add ConnectedBatchFooter wrapper"
```

---

## Task 18: Create `ConnectedMessageDetailPane` component

**Files:**
- Create: `src/features/messages/components/ConnectedMessageDetailPane.tsx`

- [ ] **Step 1: Create the component**

Write `src/features/messages/components/ConnectedMessageDetailPane.tsx`:

```tsx
"use client";

import type { HtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import { useEventId } from "../context/MessagesEventContext";
import { useMessageActions } from "../hooks/useMessageActions";
import { MessageDetailPane } from "./MessageDetailPane";

type Props = {
  player: HtmlAudioPlayer;
  fullScreen?: boolean;
};

export const ConnectedMessageDetailPane = ({ player, fullScreen }: Props) => {
  const eventId = useEventId();
  const { activeMessage, toggleFavorite, toggleGoldBook, isPending } =
    useMessageActions();

  const isCurrentTrack =
    activeMessage !== null && player.playingId === activeMessage.id;

  return (
    <MessageDetailPane
      eventId={eventId}
      message={activeMessage}
      onToggleFavorite={toggleFavorite}
      onToggleGoldBook={toggleGoldBook}
      togglePending={isPending}
      isPlayingActive={player.isPlaying && isCurrentTrack}
      isCurrentTrack={isCurrentTrack}
      progress={isCurrentTrack ? player.progress : 0}
      currentTime={isCurrentTrack ? player.currentTime : 0}
      playerDuration={isCurrentTrack ? player.duration : 0}
      onTogglePlay={() => {
        if (activeMessage) void player.toggle(activeMessage.id);
      }}
      onSeek={(ratio) => {
        if (isCurrentTrack) player.seekRatio(ratio);
      }}
      fullScreen={fullScreen}
    />
  );
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/components/ConnectedMessageDetailPane.tsx
git commit -m "feat(messages): add ConnectedMessageDetailPane wrapper"
```

---

## Task 19: Rewrite `MessagesPageClient.tsx`

**Files:**
- Modify: `src/features/messages/MessagesPageClient.tsx` (full rewrite)

- [ ] **Step 1: Replace file contents**

Overwrite `src/features/messages/MessagesPageClient.tsx`:

```tsx
"use client";

import { AudioElement } from "@peja/ui/components/AudioElement";
import type { EventStats } from "@/lib/api/types";
import type { HtmlAudioPlayer } from "@peja/ui/hooks/useHtmlAudioPlayer";
import { MessageToolbar } from "./components/MessageToolbar";
import { MessagesFilterRail } from "./components/MessagesFilterRail";
import { MessagesListBody } from "./components/MessagesListBody";
import { ConnectedBatchFooter } from "./components/ConnectedBatchFooter";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesStoreReset } from "./components/MessagesStoreReset";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { useAudioDurationSync } from "./hooks/useAudioDurationSync";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";

type MessagesPageClientProps = {
  eventId: string;
  stats: EventStats | null;
};

export const MessagesPageClient = ({
  eventId,
  stats,
}: MessagesPageClientProps) => {
  const player = useMessageAudioPlayer(eventId);

  return (
    <MessagesEventProvider eventId={eventId}>
      <MessagesStoreReset />
      <DurationSync player={player} />
      <div className="small-desktop:flex min-h-screen">
        <div className="bg-card relative flex min-w-0 flex-1 flex-col">
          <MessageToolbar stats={stats} />
          <MessagesFilterRail />
          <MessagesListBody player={player} />
          <ConnectedBatchFooter />
        </div>
        <ConnectedMessageDetailPane player={player} />
        <AudioElement ref={player.audioRef} {...player.audioProps} />
      </div>
    </MessagesEventProvider>
  );
};

const DurationSync = ({ player }: { player: HtmlAudioPlayer }) => {
  useAudioDurationSync(player);
  return null;
};
```

Note: `useAudioDurationSync` calls `useEventId()`, which throws outside the provider. The page-level `useMessageAudioPlayer(eventId)` runs before the provider mounts in JSX, so the duration-sync call goes into a tiny child component (`DurationSync`) that renders under the provider.

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/MessagesPageClient.tsx
git commit -m "refactor(messages): reduce MessagesPageClient to composition"
```

---

## Task 20: Rewrite `MessageDetailPageClient.tsx`

**Files:**
- Modify: `src/features/messages/MessageDetailPageClient.tsx` (full rewrite)

- [ ] **Step 1: Replace file contents**

Overwrite `src/features/messages/MessageDetailPageClient.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft } from "@peja/icons/ChevronLeft";
import { AudioElement } from "@peja/ui/components/AudioElement";
import { useRouter } from "@/i18n/navigation";
import { useMessageDetail } from "@/lib/query/messagesQueries";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { useDetailMessageActiveSync } from "./hooks/useDetailMessageActiveSync";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";

type MessageDetailPageClientProps = {
  eventId: string;
  messageId: string;
};

export const MessageDetailPageClient = ({
  eventId,
  messageId,
}: MessageDetailPageClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: detail } = useMessageDetail(eventId, messageId);
  const player = useMessageAudioPlayer(eventId);

  if (!detail) {
    return (
      <p className="type-body-small text-muted-foreground p-8 text-center">
        {t("messages__loading")}
      </p>
    );
  }

  return (
    <MessagesEventProvider eventId={eventId}>
      <ActiveSync messageId={messageId} />
      <div className="-mx-4 -mb-6 flex min-h-screen flex-col">
        <button
          type="button"
          onClick={() => router.back()}
          className="border-border bg-card text-foreground hover:bg-muted/50 type-body-small flex cursor-pointer items-center gap-1 border-b px-4 py-3 text-left font-semibold"
        >
          <ChevronLeft width={16} height={16} />
          {t("messages__detail__back")}
        </button>
        <ConnectedMessageDetailPane player={player} fullScreen />
        <AudioElement ref={player.audioRef} {...player.audioProps} />
      </div>
    </MessagesEventProvider>
  );
};

const ActiveSync = ({ messageId }: { messageId: string }) => {
  useDetailMessageActiveSync(messageId);
  return null;
};
```

- [ ] **Step 2: Type-check + lint**

Run: `pnpm ts-check && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/messages/MessageDetailPageClient.tsx
git commit -m "refactor(messages): reduce MessageDetailPageClient to composition"
```

---

## Task 21: Manual smoke test

**Files:** none.

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev`
Expected: server starts without compile errors. Note any warnings.

- [ ] **Step 2: Run prettier and final type check**

Open another terminal:
```
pnpm format
pnpm ts-check
pnpm lint
```
Expected: all PASS, no diff after `pnpm format`.

- [ ] **Step 3: Smoke checklist on `/app/messages`**

Walk through these in a browser, on a desktop-width window:

- [ ] Page loads, message rows visible.
- [ ] Filter chips switch — clicking each chip filters and clears selection.
- [ ] Select-all checkbox toggles all rows; clicking again clears.
- [ ] Single-row checkbox toggles selection; batch footer appears when count > 0 and shows correct count + combined duration.
- [ ] Bulk favorite toggles all selected rows' heart state and label flips between "favourite" / "unfavourite".
- [ ] Bulk gold-book button toggles inclusion + label flips.
- [ ] Bulk download triggers a download of selected messages.
- [ ] Clicking a row opens the detail pane on the right; clicking again closes.
- [ ] Clicking the row's play button starts audio; the row shows progress; the detail pane (if open) shows the same progress.
- [ ] Detail pane heart/gold-book buttons toggle the active message.
- [ ] Detail pane seek bar drags update audio position.

- [ ] **Step 4: Smoke checklist on a narrow viewport (`< 1024px`)**

- [ ] Clicking a row navigates to `/app/messages/[id]` instead of opening side pane.
- [ ] Detail page back button returns to list.
- [ ] Detail page audio plays.
- [ ] Detail page heart/gold-book toggle.

- [ ] **Step 5: Smoke checklist for empty / error / loading states**

- [ ] Set filter to one that returns 0 items (or use an empty event) — empty-state copy renders.
- [ ] If you can simulate a 500 error from `/messages`, the error copy renders. Otherwise visually confirm the loading state appears at least briefly on first nav.

- [ ] **Step 6: If everything passes, finalize**

Nothing to commit (no changes). The previous task commits are the deliverable.

If anything regresses, fix in a follow-up task; do not amend prior commits.

---

## Self-review checklist (run before declaring done)

- [ ] `pnpm ts-check` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm format:check` passes.
- [ ] Original `MessagesPageClient.tsx` no longer contains `useState`, `useEffect`, `useRef`, or `useSelectionMode`.
- [ ] Original `MessageDetailPageClient.tsx` no longer contains `useState` or duplicated audio handlers.
- [ ] No file in `src/features/messages/` has a code comment.
- [ ] No file imports `next/link` or `next/navigation`.
- [ ] No raw Tailwind colors (`text-zinc-*`, `bg-slate-*`), raw text sizes (`text-sm`, `text-xs`), raw radii (`rounded-sm`, `rounded-lg`), raw breakpoints (`sm:`, `md:`, `lg:`, `xl:`) introduced by this refactor.
- [ ] Every new component is an arrow function and one-component-per-file.
- [ ] Smoke checklist (Task 21) all green.
