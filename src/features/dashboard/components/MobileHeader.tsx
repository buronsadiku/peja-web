"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@peja/ui/components/Logo";
import { MenuIcon } from "@peja/icons/MenuIcon";

type MobileHeaderProps = {
  onMenuToggle: () => void;
};

export const MobileHeader = ({ onMenuToggle }: MobileHeaderProps) => {
  const t = useTranslations();
  return (
    <header className="border-border bg-card desktop:hidden flex items-center justify-between border-b px-4 py-3">
      <Logo />
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-10 text-foreground hover:bg-muted flex size-10 cursor-pointer items-center justify-center transition-colors"
        aria-label={t("dashboard__mobile_header__menu")}
      >
        <MenuIcon width={22} height={22} />
      </button>
    </header>
  );
};
