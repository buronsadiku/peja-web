"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { StyleOption } from "./StyleOption";
import type { QRStyle } from "./QRCodeStudio";

type StylePickerProps = {
  selectedId: string;
  onSelectStyle: (style: QRStyle) => void;
};

export const StylePicker = ({
  selectedId,
  onSelectStyle,
}: StylePickerProps) => {
  const t = useTranslations();

  const styles: Array<QRStyle & { label: string }> = [
    {
      id: "classic",
      label: t("qr_code__style__classic"),
      dark: "#2D2D2D",
      light: "#ffffff",
    },
    {
      id: "blue",
      label: t("qr_code__style__cornflower"),
      dark: "#5a7fd4",
      light: "#ffffff",
    },
    {
      id: "peach",
      label: t("qr_code__style__peach"),
      dark: "#EC8662",
      light: "#ffffff",
    },
    {
      id: "sand",
      label: t("qr_code__style__sand"),
      dark: "#F9F7F4",
      light: "#2D2D2D",
    },
  ];

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Kicker className="text-muted-foreground mb-3">
        {t("qr_code__style__eyebrow")}
      </Kicker>
      <div className="grid grid-cols-4 gap-2.5">
        {styles.map((s) => (
          <StyleOption
            key={s.id}
            label={s.label}
            dark={s.dark}
            light={s.light}
            active={selectedId === s.id}
            onClick={() =>
              onSelectStyle({ id: s.id, dark: s.dark, light: s.light })
            }
          />
        ))}
      </div>
    </div>
  );
};
