"use client";

import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@peja/icons/WhatsAppIcon";
import { SmsIcon } from "@peja/icons/SmsIcon";
import { MailIcon } from "@peja/icons/MailIcon";
import { NudgeChannelButton } from "./NudgeChannelButton";

export const GuestNudgeCard = () => {
  const t = useTranslations();
  const channels = [
    {
      label: t("guests__nudge__channel_whatsapp"),
      icon: WhatsAppIcon,
      count: 19,
      recommended: true,
    },
    {
      label: t("guests__nudge__channel_sms"),
      icon: SmsIcon,
      count: 8,
      recommended: false,
    },
    {
      label: t("guests__nudge__channel_email"),
      icon: MailIcon,
      count: 7,
      recommended: false,
    },
  ];

  return (
    <div className="rounded-20 border-border bg-card tablet:p-10 relative overflow-hidden border p-8">
      <div className="bg-destructive/15 absolute -top-8 -right-8 size-50 rounded-full" />
      <div className="relative">
        <span className="type-overline text-destructive">
          {t("guests__nudge__eyebrow")}
        </span>
        <h3 className="type-h2 mt-2.5 tracking-tight">
          {t("guests__nudge__title", { count: 34 })}
        </h3>
        <p className="type-body-small text-muted-foreground mt-2.5 max-w-xl leading-relaxed">
          {t("guests__nudge__body")}
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {channels.map((channel) => (
            <NudgeChannelButton key={channel.label} {...channel} />
          ))}
        </div>
        <div className="rounded-12 border-border bg-background type-body-small mt-5 max-w-xl border p-3.5 leading-relaxed">
          <span className="text-muted-foreground">
            {t("guests__nudge__preview_label")}
          </span>{" "}
          <span className="font-serif italic">
            {t("guests__nudge__preview_body")}
          </span>
        </div>
      </div>
    </div>
  );
};
