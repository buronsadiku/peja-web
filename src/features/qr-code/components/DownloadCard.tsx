"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Kicker } from "@peja/ui/components/Kicker";
import { FormatRow } from "./FormatRow";

type DownloadCardProps = {
  slug: string;
  shortUrl: string;
  dark: string;
  light: string;
};

const triggerDownload = (data: string, filename: string) => {
  const link = document.createElement("a");
  link.href = data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const buildLogoSrc = (background: string, foreground: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="${background}"/><text x="24" y="33" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="${foreground}">O</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const QR_EXPORT_SIZE = 1024;

export const DownloadCard = ({
  slug,
  shortUrl,
  dark,
  light,
}: DownloadCardProps) => {
  const t = useTranslations();
  const [pending, setPending] = useState<"png" | "svg" | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const logoSrc = buildLogoSrc(dark, light);

  const handlePng = () => {
    setPending("png");
    try {
      const canvas =
        canvasContainerRef.current?.querySelector("canvas") ?? null;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      triggerDownload(dataUrl, `${slug}-qr.png`);
    } finally {
      setPending(null);
    }
  };

  const handleSvg = () => {
    setPending("svg");
    try {
      const svg = svgContainerRef.current?.querySelector("svg") ?? null;
      if (!svg) return;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob(
        ['<?xml version="1.0" standalone="no"?>\r\n', source],
        { type: "image/svg+xml;charset=utf-8" },
      );
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${slug}-qr.svg`);
      URL.revokeObjectURL(url);
    } finally {
      setPending(null);
    }
  };

  const formats = [
    {
      ext: "PNG" as const,
      desc: t("qr_code__download__png_desc"),
      size: "1024×1024",
      onClick: handlePng,
      enabled: true,
    },
    {
      ext: "SVG" as const,
      desc: t("qr_code__download__svg_desc"),
      size: "vector",
      onClick: handleSvg,
      enabled: true,
    },
    {
      ext: "PDF" as const,
      desc: t("qr_code__download__pdf_desc"),
      size: "38 KB",
      enabled: false,
    },
    {
      ext: "EPS" as const,
      desc: t("qr_code__download__eps_desc"),
      size: "14 KB",
      enabled: false,
    },
  ];

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Kicker className="text-muted-foreground mb-3">
        {t("qr_code__download__eyebrow")}
      </Kicker>
      <div className="flex flex-col gap-2">
        {formats.map((f, i) => (
          <FormatRow
            key={f.ext}
            ext={f.ext}
            desc={f.desc}
            size={f.size}
            primary={i === 0}
            onClick={f.onClick}
            disabled={!f.enabled || pending !== null}
          />
        ))}
      </div>
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <div ref={canvasContainerRef}>
          <QRCodeCanvas
            value={shortUrl}
            size={QR_EXPORT_SIZE}
            level="H"
            marginSize={2}
            fgColor={dark}
            bgColor={light}
            imageSettings={{
              src: logoSrc,
              height: QR_EXPORT_SIZE / 5,
              width: QR_EXPORT_SIZE / 5,
              excavate: true,
            }}
          />
        </div>
        <div ref={svgContainerRef}>
          <QRCodeSVG
            value={shortUrl}
            size={QR_EXPORT_SIZE}
            level="H"
            marginSize={2}
            fgColor={dark}
            bgColor={light}
            imageSettings={{
              src: logoSrc,
              height: QR_EXPORT_SIZE / 5,
              width: QR_EXPORT_SIZE / 5,
              excavate: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};
