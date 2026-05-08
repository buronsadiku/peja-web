import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Button } from "@peja/ui/components/Button";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@peja/ui/components/Avatar";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { HeroShowpiece } from "../HeroShowpiece";
import { Badge } from "@peja/ui/components/Badge";
import { AVATARS } from "./constants";

export const HeroSection = () => {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden">
      <div
        className="bg-primary/20 pointer-events-none absolute -top-40 -left-40 h-150 w-150 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="bg-destructive/15 pointer-events-none absolute -right-20 -bottom-40 h-125 w-125 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="section-container relative grid grid-cols-1 items-center gap-15 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-8">
          <Badge
            variant="outline"
            className="type-body-small w-fit gap-2 px-4 py-2 font-medium normal-case shadow-sm"
          >
            <span
              className="bg-secondary h-2 w-2 shrink-0 rounded-full"
              aria-hidden="true"
            />
            {t("marketing__hero__badge", { count: "2,840", countries: "34" })}
          </Badge>

          <SectionTitle as="h1" className="leading-none tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__hero__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__hero__title_line2")}
            </span>
          </SectionTitle>

          <p className="text-muted-foreground type-body-large max-w-130 leading-relaxed">
            {t("marketing__hero__description")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href={appRoutes.auth.signUp}>
                {t("marketing__hero__cta_primary")}
                <ArrowRightIcon width={18} height={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={appRoutes.marketing.sample}>
                {t("marketing__hero__cta_secondary")}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <AvatarGroup>
              {AVATARS.map((avatar) => (
                <Avatar key={avatar.initials}>
                  <AvatarFallback
                    className="text-primary-foreground type-body-small font-semibold"
                    style={{ background: avatar.tint }}
                  >
                    {avatar.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <p className="text-muted-foreground type-body-small">
              {t("marketing__hero__social_proof", { rating: "4.9" })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <HeroShowpiece />
        </div>
      </div>
    </section>
  );
};
