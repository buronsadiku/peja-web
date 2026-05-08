"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon } from "@peja/icons/MenuIcon";
import { XIcon } from "@peja/icons/XIcon";
import { Logo } from "@peja/ui/components/Logo";
import { Button } from "@peja/ui/components/Button";
import { ThemeToggle } from "@peja/ui/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  VisuallyHidden,
} from "@peja/ui/components/Sheet";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type RootMobileNavProps = {
  languageSelect: ReactNode;
};

export const RootMobileNav = ({ languageSelect }: RootMobileNavProps) => {
  const t = useTranslations();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="text-foreground hover:bg-muted tablet:hidden flex size-9 items-center justify-center rounded-full transition"
        >
          <MenuIcon className="size-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col gap-0 p-0">
        <VisuallyHidden.Root>
          <SheetTitle>{t("marketing__nav__how_it_works")}</SheetTitle>
        </VisuallyHidden.Root>

        <div className="border-border flex h-19 shrink-0 items-center justify-between border-b px-6">
          <SheetClose asChild>
            <Link href={appRoutes.home}>
              <Logo />
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <button
              aria-label="Close menu"
              className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-full transition"
            >
              <XIcon className="size-5" />
            </button>
          </SheetClose>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          <SheetClose asChild>
            <Link
              href={appRoutes.marketing.howItWorks}
              className="text-foreground type-body-large rounded-12 hover:bg-muted px-3 py-3.5 font-medium transition"
            >
              {t("marketing__nav__how_it_works")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={appRoutes.marketing.keepsakes}
              className="text-foreground type-body-large rounded-12 hover:bg-muted px-3 py-3.5 font-medium transition"
            >
              {t("marketing__nav__keepsakes")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={appRoutes.marketing.pricing}
              className="text-foreground type-body-large rounded-12 hover:bg-muted px-3 py-3.5 font-medium transition"
            >
              {t("marketing__nav__pricing")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={appRoutes.marketing.stories}
              className="text-foreground type-body-large rounded-12 hover:bg-muted px-3 py-3.5 font-medium transition"
            >
              {t("marketing__nav__stories")}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={appRoutes.marketing.forPlanners}
              className="text-foreground type-body-large rounded-12 hover:bg-muted px-3 py-3.5 font-medium transition"
            >
              {t("marketing__nav__for_planners")}
            </Link>
          </SheetClose>
        </nav>

        <div className="border-border shrink-0 border-t px-6 py-6">
          <div className="mb-5 flex items-center gap-4">
            {languageSelect}
            <ThemeToggle />
          </div>
          <Button asChild className="w-full gap-1.5" variant="outline">
            <Link
              href={appRoutes.auth.signIn}
              className="text-foreground type-body mb-3 block font-semibold"
            >
              {t("marketing__nav__sign_in")}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
