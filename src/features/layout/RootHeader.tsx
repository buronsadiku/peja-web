import { useTranslations } from "next-intl";
import { Logo } from "@peja/ui/components/Logo";
import { Button } from "@peja/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { ThemeToggle } from "@peja/ui/components/ThemeToggle";
import { cn } from "@peja/ui/utils/cn";
import { RootMobileNav } from "./RootMobileNav";
import { LanguageSelect } from "@/components/LanguageSelect";

export const RootHeader = ({ className }: { className?: string }) => {
  const t = useTranslations();

  return (
    <header
      className={cn(
        "border-border bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-19 items-center justify-between px-6 lg:px-20">
        <Link href={appRoutes.home}>
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <span className="tablet:flex hidden">
            <LanguageSelect />
          </span>

          <Button size="sm" asChild className="tablet:flex hidden gap-1.5">
            <Link href={appRoutes.auth.signUp}>
              {t("marketing__nav__cta")}
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
          <RootMobileNav languageSelect={<LanguageSelect />} />
        </div>
      </div>
    </header>
  );
};
