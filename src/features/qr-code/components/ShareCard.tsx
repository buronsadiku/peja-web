"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { WhatsAppIcon } from "@peja/icons/WhatsAppIcon";
import { MailIcon } from "@peja/icons/MailIcon";
import { SmsIcon } from "@peja/icons/SmsIcon";
import { AirDropIcon } from "@peja/icons/AirDropIcon";
import { ShareChannel } from "./ShareChannel";

type ShareCardProps = {
  url?: string;
};

export const ShareCard = ({ url = "lena-and-tomas" }: ShareCardProps) => {
  const t = useTranslations();
  const shareUrl = `https://peja.love/${url}`;
  const shareBody = `${t("qr_code__share__suggested_a")}${shareUrl}${t("qr_code__share__suggested_b")}`;
  const encodedBody = encodeURIComponent(shareBody);
  const subject = encodeURIComponent(t("qr_code__share__email_subject"));

  const handleAirdrop = async () => {
    const nav =
      typeof navigator === "undefined"
        ? null
        : (navigator as Navigator & {
            share?: (data: { text?: string; url?: string }) => Promise<void>;
          });
    if (nav?.share) {
      try {
        await nav.share({ text: shareBody, url: shareUrl });
        return;
      } catch {
        return;
      }
    }
    if (nav?.clipboard) {
      try {
        await nav.clipboard.writeText(shareUrl);
      } catch {
        return;
      }
    }
  };

  const channels = [
    {
      id: "whatsapp",
      label: t("qr_code__share__channel_whatsapp"),
      color: "#25D366",
      href: `https://wa.me/?text=${encodedBody}`,
      Icon: WhatsAppIcon,
    },
    {
      id: "email",
      label: t("qr_code__share__channel_email"),
      color: "oklch(0.705 0.120 262.5)",
      href: `mailto:?subject=${subject}&body=${encodedBody}`,
      Icon: MailIcon,
    },
    {
      id: "messages",
      label: t("qr_code__share__channel_messages"),
      color: "#2CBE4E",
      href: `sms:?&body=${encodedBody}`,
      Icon: SmsIcon,
    },
  ] as const;

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Kicker className="text-muted-foreground mb-3">
        {t("qr_code__share__eyebrow")}
      </Kicker>
      <div className="grid grid-cols-4 gap-2.5">
        {channels.map((c) => (
          <ShareChannel
            key={c.id}
            label={c.label}
            color={c.color}
            href={c.href}
            Icon={c.Icon}
          />
        ))}
        <ShareChannel
          label={t("qr_code__share__channel_airdrop")}
          color="#0C84FE"
          onClick={handleAirdrop}
          Icon={AirDropIcon}
        />
      </div>

      <div className="rounded-10 border-border bg-background mt-3.5 border border-dashed p-3">
        <p className="type-overline text-muted-foreground tracking-wider">
          {t("qr_code__share__suggested_label")}
        </p>
        <p className="type-body-small text-foreground mt-1 font-serif italic">
          {t("qr_code__share__suggested_a")}{" "}
          <span className="font-mono not-italic">peja.love/{url}</span>
          {t("qr_code__share__suggested_b")}
        </p>
      </div>
    </div>
  );
};
