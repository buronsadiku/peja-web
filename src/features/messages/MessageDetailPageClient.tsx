"use client";

import { useTranslations } from "next-intl";
import { ChevronLeftIcon } from "@peja/icons/ChevronLeftIcon";
import { AudioPlayer } from "@peja/ui/components/AudioPlayer";
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
          <ChevronLeftIcon width={16} height={16} />
          {t("messages__detail__back")}
        </button>
        <ConnectedMessageDetailPane player={player} fullScreen />
        <AudioPlayer player={player} />
      </div>
    </MessagesEventProvider>
  );
};

const ActiveSync = ({ messageId }: { messageId: string }) => {
  useDetailMessageActiveSync(messageId);
  return null;
};
