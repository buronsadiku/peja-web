"use client";

import { useTranslations } from "next-intl";

type CountdownCardProps = {
  days: number;
};

export const CountdownCard = ({ days }: CountdownCardProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-16 relative border border-white/15 bg-white/10 p-4.5 backdrop-blur-sm">
      <p className="type-overline tracking-[1.5px] opacity-70">
        {t("auth__signup__countdown__label")}
      </p>
      <div className="mt-2 flex items-baseline gap-4.5">
        <div>
          <span className="type-h1 font-semibold">{days}</span>
          <span className="type-body-small ml-1.5 opacity-70">
            {t("auth__signup__countdown__days")}
          </span>
        </div>
        <p className="type-caption opacity-70">
          {t("auth__signup__countdown__hint")}
        </p>
      </div>
    </div>
  );
};
