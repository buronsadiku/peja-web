"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { AudioPlayer } from "@peja/ui/components/AudioPlayer";
import { Link, useRouter } from "@/i18n/navigation";
import type { MessageRowView } from "@/features/messages/adapters";
import { useMessageAudioPlayer } from "@/features/messages/hooks/useMessageAudioPlayer";
import { messagesClient } from "@/lib/api/messages-client";
import { queryKeys } from "@/lib/query/keys";
import { MessageRow } from "./MessageRow";

type MessageListProps = {
  eventId: string;
  messages: MessageRowView[];
  totalCount: number;
};

export const MessageList = ({
  eventId,
  messages,
  totalCount,
}: MessageListProps) => {
  const t = useTranslations();
  const router = useRouter();
  const qc = useQueryClient();
  const player = useMessageAudioPlayer(eventId);

  const audioIds = messages
    .slice(0, 5)
    .filter((m) => m.hasAudio)
    .map((m) => m.id);
  const audioIdsKey = audioIds.join(",");
  const [warmUrls, setWarmUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!audioIds.length) return;
    let cancelled = false;
    Promise.all(
      audioIds.map((id) =>
        qc.fetchQuery({
          queryKey: queryKeys.messages.detail(eventId, id),
          queryFn: () => messagesClient.get(eventId, id),
        }),
      ),
    ).then((results) => {
      if (cancelled) return;
      const urls = results
        .map((r) => r?.message.audioUrl)
        .filter((u): u is string => Boolean(u));
      setWarmUrls(urls);
    });
    return () => {
      cancelled = true;
    };
  }, [eventId, qc, audioIdsKey]);

  if (messages.length === 0) {
    return (
      <div className="rounded-20 border-border bg-card border p-8 text-center">
        <h2 className="type-h2 font-semibold">
          {t("dashboard__messages__empty_title")}
        </h2>
        <p className="type-body-small text-muted-foreground mt-2">
          {t("dashboard__messages__empty_body")}
        </p>
      </div>
    );
  }

  const visible = messages.slice(0, 5);

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="type-h2 font-semibold">
          {t("dashboard__messages__title")}
        </h2>
        <Link
          href={`/app/messages`}
          className="type-body-small text-primary font-semibold"
        >
          {t("dashboard__messages__see_all", { count: totalCount })}
        </Link>
      </div>

      <div className="rounded-20 border-border bg-card overflow-hidden border">
        {visible.map((m, i) => {
          const isCurrent = player.playingId === m.id;
          return (
            <MessageRow
              key={m.id}
              name={m.name}
              relation={m.relation}
              quote={m.note || m.quote}
              initials={m.initials}
              tint={m.tint}
              wave={m.wave}
              index={i}
              hasAudio={m.hasAudio}
              playing={isCurrent && player.isPlaying}
              progress={isCurrent ? player.progress : 0}
              duration={m.duration}
              currentTime={isCurrent ? player.currentTime : 0}
              onPlay={() => {
                if (m.hasAudio) void player.toggle(m.id);
              }}
              onSelect={() => router.push(`/app/messages?active=${m.id}`)}
            />
          );
        })}
      </div>
      <AudioPlayer player={player} />
      {warmUrls.map((url) => (
        <audio
          key={url}
          src={url}
          preload="auto"
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};
