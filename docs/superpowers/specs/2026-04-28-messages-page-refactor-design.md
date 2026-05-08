# Messages Page Refactor — Design

**Date:** 2026-04-28
**Scope:** `src/features/messages/MessagesPageClient.tsx`, `src/features/messages/MessageDetailPageClient.tsx`, plus a new shared `AudioElement` and `useHtmlAudioPlayer` in `@peja/ui`.

## Goals

1. Shrink `MessagesPageClient.tsx` from ~330 lines into a thin composition file (~30 lines).
2. Replace ad-hoc `useState` / `useEffect` / `useSelectionMode` with a feature-scoped Zustand store and React Query mutations.
3. Eliminate prop drilling by introducing connected components that read the store and player directly.
4. Move the `<audio>` element wiring into `@peja/ui` so any feature can reuse it.
5. Apply the same refactor to `MessageDetailPageClient.tsx`, killing duplicated audio + toggle wiring.
6. Keep all existing presentational components (`MessageRow`, `MessageDayList`, `MessageDetailPane`, `MessageBatchFooter`) prop-driven and untouched in interface.

## Non-goals

- Visual / UX changes. The output must look and behave identically.
- Refactoring `useSelectionMode` itself (it stays in `src/lib/hooks/` for other features).
- Touching `messagesQueries.ts`, `adapters.ts`, `utils.ts`, `messages-client.ts`.

## Architecture overview

```
@peja/ui
├── src/components/AudioElement.tsx      ← presentational <audio> wrapper
└── src/hooks/useHtmlAudioPlayer.ts      ← domain-agnostic player core

src/features/messages/
├── store/
│   └── useMessagesStore.ts              ← filter + selectedIds + activeMessageId
├── context/
│   └── MessagesEventContext.tsx         ← provides eventId to hooks
├── hooks/
│   ├── useMessageAudioPlayer.ts         ← thin wrapper over useHtmlAudioPlayer
│   ├── useMessageList.ts                ← reads filter from store, returns views
│   ├── useMessageBulkActions.ts         ← bulk fav/goldbook/download via useMutation
│   ├── useMessageActions.ts             ← single-message toggle fav/goldbook
│   ├── useAudioDurationSync.ts          ← isolated useEffect for duration write-back
│   ├── useResponsiveRowOpen.ts          ← matchMedia + router.push vs setActive
│   └── useDetailMessageActiveSync.ts    ← pushes messageId into store on detail page
├── components/
│   ├── MessagesFilterRail.tsx           ← chips + select-all (reads store)
│   ├── MessagesListBody.tsx             ← loading/error/empty/list switch
│   ├── MessagesStoreReset.tsx           ← one-shot reset on page mount
│   ├── ConnectedMessageDayList.tsx
│   ├── ConnectedMessageDetailPane.tsx
│   └── ConnectedBatchFooter.tsx
├── MessagesPageClient.tsx               ← composition only (~30 lines)
└── MessageDetailPageClient.tsx          ← composition only (~25 lines)
```

## Store contract

`src/features/messages/store/useMessagesStore.ts`:

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
  activeMessageId: null,
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
  reset: () => set(initial),
}));

export const useFilter = () => useMessagesStore((s) => s.filter);
export const useSelectedIds = () => useMessagesStore((s) => s.selectedIds);
export const useActiveMessageId = () =>
  useMessagesStore((s) => s.activeMessageId);
```

**Behaviors:**

- `setFilter` clears selection and active message; switching filter must not strand selected ids.
- `selectedIds` stays a `Set<string>` for O(1) membership; updates always construct a new `Set` so reference equality flips.
- The page mounts a one-shot `reset()` on mount via a `<MessagesStoreReset />` child component (no `useEffect` in the page itself).

## Event context

`src/features/messages/context/MessagesEventContext.tsx`:

```ts
"use client";
import { createContext, useContext } from "react";

const MessagesEventContext = createContext<string | null>(null);

export const MessagesEventProvider = ({
  eventId,
  children,
}: {
  eventId: string;
  children: React.ReactNode;
}) => (
  <MessagesEventContext.Provider value={eventId}>
    {children}
  </MessagesEventContext.Provider>
);

export const useEventId = () => {
  const id = useContext(MessagesEventContext);
  if (!id) throw new Error("useEventId must be used inside MessagesEventProvider");
  return id;
};
```

Hooks call `useEventId()` so connected components don't need an `eventId` prop.

## Hooks layer

### `useMessageList()`

```ts
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

### `useMessageBulkActions()`

Wraps a single `useMutation` whose `mutationFn` switches on `kind`. Replaces the manual `bulkPending` `useState`. Reads selection from store and views from `useMessageList`.

```ts
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

  return {
    bulkFavorite: () =>
      mutation.mutate({
        kind: "favorite",
        ids: Array.from(selectedIds),
        nextValue: !allFavorited,
      }),
    bulkAddToGoldBook: () =>
      mutation.mutate({
        kind: "goldbook",
        ids: Array.from(selectedIds),
        nextValue: !allInGoldBook,
      }),
    bulkDownload: () =>
      mutation.mutate({ kind: "download", ids: Array.from(selectedIds) }),
    isPending: mutation.isPending,
    allFavorited,
    allInGoldBook,
    selectedCount: selectedIds.size,
    selectedDurationSec,
  };
};
```

### `useMessageActions()`

```ts
export const useMessageActions = () => {
  const eventId = useEventId();
  const activeId = useActiveMessageId();
  const { messageViews } = useMessageList();
  const updateMessage = useUpdateMessage(eventId);

  const active = activeId
    ? (messageViews.find((m) => m.id === activeId) ?? null)
    : null;

  return {
    activeMessage: active,
    toggleFavorite: () => {
      if (!active) return;
      updateMessage.mutate({
        messageId: active.id,
        input: { isFavorite: !active.favorited },
      });
    },
    toggleGoldBook: () => {
      if (!active) return;
      updateMessage.mutate({
        messageId: active.id,
        input: { isGoldBookSelected: !active.inGoldBook },
      });
    },
    isPending: updateMessage.isPending,
  };
};
```

### `useAudioDurationSync(player)`

The single legitimate `useEffect` in the feature, isolated. Reads `eventId` from context.

### `useResponsiveRowOpen(player)`

Returns `{ openRow, playRow }`. Internally uses `window.matchMedia("(max-width: 1023.98px)")` lazily inside the handler — no `useEffect`. Calls `useRouter` from `@/i18n/navigation` and `setActiveMessageId` / `toggleActiveMessageId` from the store.

### `useMessageAudioPlayer(eventId)` (thin wrapper)

Becomes a 6-line bridge over `useHtmlAudioPlayer({ resolveSrc })`. The `resolveSrc` callback closes over React Query + `messagesClient` to produce the audio URL.

## Shared `@peja/ui` additions

### `packages/ui/src/components/AudioElement.tsx`

Presentational only. Forwards a ref. Default `hidden` styling.

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

### `packages/ui/src/hooks/useHtmlAudioPlayer.ts`

Domain-agnostic core. Exposes:

```ts
type UseHtmlAudioPlayerOptions = {
  resolveSrc: (id: string) => Promise<string | null>;
};

type HtmlAudioPlayer = {
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
): HtmlAudioPlayer;
```

Internals are byte-for-byte the existing `useMessageAudioPlayer` body with `ensureAudioUrl` swapped for `options.resolveSrc`. Cleanup `useEffect` stays here (legit side effect).

`@peja/ui` stays free of `@tanstack/react-query` and the messages API client.

## Connected components

### `ConnectedMessageDayList`

Reads `messageViews`, `selectedIds`, `activeMessageId`, player props; calls `useResponsiveRowOpen(player)` for `openRow` / `playRow`; calls `toggleSelected` from store. Renders `<MessageDayList />`.

### `ConnectedBatchFooter`

Calls `useMessageBulkActions()`. Renders `<MessageBatchFooter />` with no props from the page.

### `ConnectedMessageDetailPane`

Resolves `activeMessage` via `useMessageActions()`. Computes player-relative props (`isPlayingActive`, `progress`, etc.) inline against the player. Takes only `{ player, fullScreen? }` — same component serves both pages.

### `MessagesFilterRail`

Owns `FILTER_VALUES`, chip building, and the select-all checkbox. Reads `filter`, `selectedIds`, `messageViews.length` directly from the store / hook. No props.

### `MessagesListBody`

Loading / error / empty / list switch. Renders `<ConnectedMessageDayList player={player} />` on success.

## Final composition files

### `MessagesPageClient.tsx`

```tsx
"use client";
import { AudioElement } from "@peja/ui/components/AudioElement";
import { MessageToolbar } from "./components/MessageToolbar";
import { MessagesFilterRail } from "./components/MessagesFilterRail";
import { MessagesListBody } from "./components/MessagesListBody";
import { ConnectedBatchFooter } from "./components/ConnectedBatchFooter";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { MessagesStoreReset } from "./components/MessagesStoreReset";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
import { useAudioDurationSync } from "./hooks/useAudioDurationSync";
import type { EventStats } from "@/lib/api/types";

type Props = { eventId: string; stats: EventStats | null };

export const MessagesPageClient = ({ eventId, stats }: Props) => {
  const player = useMessageAudioPlayer(eventId);
  useAudioDurationSync(player);

  return (
    <MessagesEventProvider eventId={eventId}>
      <MessagesStoreReset />
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
```

### `MessageDetailPageClient.tsx`

```tsx
"use client";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "@peja/icons/ChevronLeft";
import { AudioElement } from "@peja/ui/components/AudioElement";
import { useRouter } from "@/i18n/navigation";
import { useMessageDetail } from "@/lib/query/messagesQueries";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
import { useDetailMessageActiveSync } from "./hooks/useDetailMessageActiveSync";

type Props = { eventId: string; messageId: string };

export const MessageDetailPageClient = ({ eventId, messageId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: detail } = useMessageDetail(eventId, messageId);
  const player = useMessageAudioPlayer(eventId);
  useDetailMessageActiveSync(messageId);

  if (!detail) {
    return (
      <p className="type-body-small text-muted-foreground p-8 text-center">
        {t("messages__loading")}
      </p>
    );
  }

  return (
    <MessagesEventProvider eventId={eventId}>
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
```

`useDetailMessageActiveSync(messageId)` is a small hook that pushes `messageId` into the store on mount so `ConnectedMessageDetailPane` resolves the active message uniformly. (One legitimate `useEffect`, isolated.)

The detail page also needs the row's adapted view, since `ConnectedMessageDetailPane` reads from the list query. For the detail page we adapt the single `detail.message` into a `MessageRowView` inside `useMessageActions` when `messageViews` doesn't contain the id:

```ts
const eventId = useEventId();
const activeId = useActiveMessageId();
const { messageViews } = useMessageList();
const fromList = activeId ? messageViews.find((m) => m.id === activeId) : null;
const cachedDetail = useQueryClient().getQueryData<{ message: MessageDetail }>(
  activeId ? queryKeys.messages.detail(eventId, activeId) : ["noop"],
);
const fromCache =
  !fromList && cachedDetail ? toMessageRowViewFromDetail(cachedDetail.message, anonymous) : null;
const active = fromList ?? fromCache ?? null;
```

`toMessageRowViewFromDetail` is a tiny adapter added to `adapters.ts` that mirrors the inline construction currently in `MessageDetailPageClient.tsx`. Keeps both pages on the same connected component.

## What disappears from the original page

| Removed                                  | Replaced by                              |
| ---------------------------------------- | ---------------------------------------- |
| `useState<MessageFilter>`                | store `filter`                           |
| `useState<string \| null>` (active)      | store `activeMessageId`                  |
| `useSelectionMode<string>()`             | store `selectedIds` + actions            |
| `useState(bulkPending)`                  | `useMutation().isPending`                |
| `useEffect` for duration sync            | `useAudioDurationSync`                   |
| `useRef(syncedDurationsRef)`             | encapsulated in `useAudioDurationSync`   |
| Inline `handle*` callbacks (10+)         | hooks + connected components             |
| `<audio>` + 6 handler props              | `<AudioElement {...player.audioProps} />` |
| Duplicated audio wiring in detail page   | shared `AudioElement`                    |

## Testing strategy

- Manual smoke: list page loads, filter chips switch, select-all toggles all, bulk actions run, single-message toggle works, row click navigates on mobile, plays inline on desktop, audio plays/pauses, seek bar drags.
- Detail page: navigates via `/app/messages/[id]`, back button works, audio plays, fav/goldbook toggles persist.
- No automated tests are added in this refactor — the codebase doesn't currently have test scaffolding for this feature, and adding it is out of scope.

## Conventions enforced

- `'use client'` on every file that uses hooks / store / context.
- Arrow function components.
- Imports from `@/i18n/navigation`, never `next/link` / `next/navigation`.
- No raw Tailwind colors / sizes / radii / shadows.
- One component per file; sub-components (none expected here) get folder + `index.ts`.
- No code comments.

## Risks & mitigations

- **Risk:** detail page renders before `useDetailMessageActiveSync` has set the active id, causing `ConnectedMessageDetailPane` to render the empty state for one frame. **Mitigation:** the hook calls `setActiveMessageId(messageId)` synchronously during render via `useState` initializer pattern (or render `null` until set, since we already gate on `!detail`).
- **Risk:** Zustand `Set` reference equality bugs if a consumer mutates the existing Set. **Mitigation:** every selection action constructs a new `Set`; document this in the store file's surrounding code via naming, not comments.
- **Risk:** `setFilter` clearing selection surprises a user mid-task. **Mitigation:** matches the original implicit behavior (selection wasn't persisted across refetches anyway since ids could disappear).
- **Risk:** `@peja/ui` package adding a hook with React imports. **Mitigation:** `useHtmlAudioPlayer` only depends on `react` (already a peer dep) — no new package deps.

## Out of scope

- Refactoring `useMessageAudioPlayer`'s public surface beyond returning `audioProps`.
- Touching `MessageRow`, `MessageDayList`, `MessageDetailPane`, `MessageBatchFooter` interfaces.
- Migrating other features off `useSelectionMode`.
- Adding tests.

## One-line summary of the new `MessagesPageClient.tsx`

The page becomes a layout-only composition: mount provider, mount audio player + duration sync, render five children that each pull the state they need from the store. No props between siblings, no callback chains, no local component state.
