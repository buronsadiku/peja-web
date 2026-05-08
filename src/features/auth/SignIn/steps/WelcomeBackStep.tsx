"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { Polaroid } from "../components/Polaroid";
import { LoaderDots } from "../components/LoaderDots";

export const WelcomeBackStep = () => {
  const t = useTranslations();
  const polaroids = [
    {
      top: 130,
      left: 150,
      rotation: -8,
      initial: "M",
      tint: "#EFC9A8",
      name: t("auth__signin__welcome__polaroid_margot"),
    },
    {
      top: 650,
      left: 210,
      rotation: 10,
      initial: "A",
      tint: "#EC8662",
      name: t("auth__signin__welcome__polaroid_angela"),
    },
    {
      top: 120,
      right: 190,
      rotation: 7,
      initial: "J",
      tint: "#779FEB",
      name: t("auth__signin__welcome__polaroid_joan"),
    },
    {
      top: 620,
      right: 160,
      rotation: -6,
      initial: "E",
      tint: "#82E19D",
      name: t("auth__signin__welcome__polaroid_elise"),
    },
  ];
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(900px_500px_at_50%_20%,_oklch(0.705_0.120_262.5/0.18),_transparent_60%),radial-gradient(700px_500px_at_10%_90%,_oklch(0.833_0.132_151.8/0.10),_transparent_60%),radial-gradient(700px_500px_at_90%_80%,_oklch(0.723_0.135_40/0.08),_transparent_60%)]">
      {polaroids.map((p) => (
        <Polaroid key={p.name} {...p} />
      ))}

      <div className="relative max-w-170 text-center">
        <Kicker className="text-primary mb-4.5 tracking-[2.5px]">
          {t("auth__signin__welcome__eyebrow")}
        </Kicker>
        <h1 className="tablet:type-display type-display leading-none font-semibold tracking-tight">
          {t("auth__signin__welcome__title_a")}
          <br />
          <span className="text-primary italic">
            {t("auth__signin__welcome__title_b")}
          </span>
        </h1>
        <p className="type-body-large text-muted-foreground mx-auto mt-5.5 max-w-130 leading-relaxed">
          {t.rich("auth__signin__welcome__body_voices_full", {
            voices: (chunks) => (
              <strong className="text-foreground">{chunks}</strong>
            ),
            photos: (chunks) => (
              <strong className="text-foreground">{chunks}</strong>
            ),
            voicesCount: 12,
            photosCount: 4,
          })}
        </p>

        <div className="mt-10">
          <LoaderDots />
        </div>
      </div>
    </div>
  );
};
