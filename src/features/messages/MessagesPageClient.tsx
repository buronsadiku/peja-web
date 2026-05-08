"use client";

import { AudioPlayer } from "@peja/ui/components/AudioPlayer";
import type { EventStats } from "@/lib/api/types";
import type { TAudioPlayer } from "@peja/ui/hooks/useAudioPlayer";
import { MessageToolbar } from "./components/MessageToolbar";
import { MessagesFilterRail } from "./components/MessagesFilterRail";
import { MessagesListBody } from "./components/MessagesListBody";
import { ConnectedBatchFooter } from "./components/ConnectedBatchFooter";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesStoreReset } from "./components/MessagesStoreReset";
import { MessagesActiveSync } from "./components/MessagesActiveSync";
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
      <MessagesActiveSync />
      <DurationSync player={player} />
      <div className="flex h-full w-full flex-1 overflow-auto">
        <div className="bg-card relative flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto">
          <MessageToolbar stats={stats} />
          <MessagesFilterRail stats={stats} />
          <MessagesListBody player={player} />
          <ConnectedBatchFooter />
        </div>
        <ConnectedMessageDetailPane player={player} />
        <AudioPlayer player={player} />
      </div>
    </MessagesEventProvider>
  );
};

const DurationSync = ({ player }: { player: TAudioPlayer }) => {
  useAudioDurationSync(player);
  return null;
};
