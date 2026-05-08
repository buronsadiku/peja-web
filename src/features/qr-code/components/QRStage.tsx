"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { QRTabButton } from "./QRTabButton";

type QRStageProps = {
  coupleName: string;
  shortUrl: string;
  dark: string;
  light: string;
};

const displayUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    return `${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

const buildLogoSrc = (background: string, foreground: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="${background}"/><text x="24" y="33" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="${foreground}">O</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const QRStage = ({
  coupleName,
  shortUrl,
  dark,
  light,
}: QRStageProps) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    t("qr__stage__tab_standard"),
    t("qr__stage__tab_with_photo"),
    t("qr__stage__tab_poster"),
  ];

  const logoSrc = buildLogoSrc(dark, light);

  return (
    <div className="rounded-20 from-primary to-primary/80 tablet:p-12 relative flex flex-col items-center gap-5 overflow-hidden bg-gradient-to-br p-7">
      <div
        className="pointer-events-none absolute -top-15 -right-15 size-55 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-50 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
        }}
      />

      <div className="text-primary-foreground relative text-center">
        <p className="type-overline tracking-[2px] opacity-85">
          {t("qr__stage__overline")}
        </p>
        <p className="tablet:type-h1 type-h2 mt-1.5 font-medium italic">
          {coupleName}
        </p>
      </div>

      <div
        className="rounded-16 relative p-5 shadow-lg"
        style={{ background: light }}
      >
        <QRCodeSVG
          value={shortUrl}
          size={220}
          level="H"
          marginSize={0}
          fgColor={dark}
          bgColor={light}
          imageSettings={{
            src: logoSrc,
            height: 44,
            width: 44,
            excavate: true,
          }}
        />
      </div>

      <p className="type-body-small text-primary-foreground/90 relative font-mono tracking-wider">
        {displayUrl(shortUrl)}
      </p>

      <div className="relative flex gap-2">
        {tabs.map((tab, i) => (
          <QRTabButton
            key={tab}
            label={tab}
            active={activeTab === i}
            onClick={() => setActiveTab(i)}
          />
        ))}
      </div>
    </div>
  );
};
