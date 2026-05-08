import { useTranslations } from "next-intl";
import { MicIcon } from "@peja/icons/MicIcon";
import { ImageIcon } from "@peja/icons/ImageIcon";
import { HeartIcon } from "@peja/icons/HeartIcon";
import { MailIcon } from "@peja/icons/MailIcon";
import type { EventStats, InvitationStats } from "@/lib/api/types";
import { GuestStatCard } from "./GuestStatCard";

type GuestStatBarProps = {
  stats: EventStats;
  invitations: InvitationStats | null;
};

export const GuestStatBar = ({ stats, invitations }: GuestStatBarProps) => {
  const t = useTranslations();
  const items = [
    {
      value: stats.totalMessages,
      label: t("guests__stats__messages"),
      sub: t("guests__stats__messages_sub", {
        audio: stats.audioMessages,
        written: stats.writtenMessages,
      }),
      icon: MicIcon,
      tone: "primary" as const,
    },
    {
      value: stats.photoCount,
      label: t("guests__stats__with_photo"),
      sub: t("guests__stats__with_photo_sub", { count: stats.videoCount }),
      icon: ImageIcon,
      tone: "primary" as const,
    },
    {
      value: stats.favorites,
      label: t("guests__stats__favourited"),
      sub: t("guests__stats__favourited_sub"),
      icon: HeartIcon,
      tone: "accent" as const,
    },
  ];

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid grid-cols-2 gap-4">
      {items.map((stat) => (
        <GuestStatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          sub={stat.sub}
          icon={stat.icon}
          tone={stat.tone}
        />
      ))}
    </div>
  );
};
