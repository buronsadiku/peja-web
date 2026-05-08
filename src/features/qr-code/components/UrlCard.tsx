"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { LinkIcon } from "@peja/icons/LinkIcon";

type UrlCardProps = {
  slug: string;
  shortUrl: string;
};

const displayUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    return `${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

export const UrlCard = ({ slug, shortUrl }: UrlCardProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Kicker className="text-muted-foreground mb-2.5">
        {t("qr__url__eyebrow")}
      </Kicker>
      <div className="flex items-center gap-2.5">
        <LinkIcon width={16} height={16} className="text-muted-foreground" />
        <span className="type-body-small text-foreground flex-1 truncate font-mono">
          {displayUrl(shortUrl)}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors"
        >
          {copied ? t("qr__url__copied") : t("qr__url__copy")}
        </button>
      </div>
      <div className="type-caption text-muted-foreground mt-2.5 flex items-center gap-1.5">
        <span className="bg-secondary size-1.5 rounded-full" />
        {t("qr__url__slug")} <span className="font-mono">{slug}</span>
      </div>
    </div>
  );
};
