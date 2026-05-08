"use client";

import type { TAudioPlayer } from "@peja/ui/hooks/useAudioPlayer";
import {
  useActiveMessageId,
  useMessagesStore,
  useSelectedIds,
} from "../store/useMessagesStore";
import { useMessageList } from "../hooks/useMessageList";
import { useResponsiveRowOpen } from "../hooks/useResponsiveRowOpen";
import { MessageDayList } from "./MessageDayList";

type Props = {
  player: TAudioPlayer;
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
