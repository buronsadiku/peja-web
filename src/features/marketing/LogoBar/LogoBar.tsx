import { useTranslations } from "next-intl";
import { LogoName } from "./LogoName";
import { LOGOS } from "./constants";

export const LogoBar = () => {
  const t = useTranslations();

  return (
    <div className="border-border border-t">
      <div className="section-container">
        <p className="text-muted-foreground type-overline mb-6 text-center font-bold tracking-[2.2px] uppercase">
          {t("marketing__logos__title")}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 opacity-50">
          {LOGOS.map((name) => (
            <LogoName key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
};
