import { useTranslations } from "next-intl";
import { CheckIcon } from "@peja/icons/CheckIcon";
import { Card } from "@peja/ui/components/Card";
import { HeroAudioLazy } from "./HeroAudioLazy";

export const HeroShowpiece = () => {
  const t = useTranslations();

  return (
    <div className="relative h-155 w-full">
      <Card className="absolute top-8 left-4 z-1 w-48 rotate-[-9deg] overflow-hidden rounded-2xl shadow-xl">
        <div className="from-muted to-muted-foreground/20 relative flex h-36 items-center justify-center bg-linear-to-br">
          <span className="text-foreground/70 type-display font-semibold italic">
            M
          </span>
        </div>
        <div className="p-3">
          <p className="text-muted-foreground type-caption font-medium">
            {t("marketing__showpiece__caption_margot")}
          </p>
        </div>
      </Card>

      <div className="bg-card border-border absolute top-4 left-44 z-4 flex rotate-[4deg] items-center gap-2 rounded-full border px-3 py-2 shadow-lg">
        <span className="bg-secondary text-secondary-foreground flex h-5 w-5 items-center justify-center rounded-full">
          <CheckIcon />
        </span>
        <div>
          <p className="text-foreground type-caption leading-none font-semibold">
            {t("marketing__showpiece__just_arrived")}
          </p>
          <p className="text-muted-foreground type-overline mt-0.5">
            {t("marketing__showpiece__caption_abuela")}
          </p>
        </div>
      </div>

      <Card className="absolute top-28 left-22 z-3 w-110 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="from-destructive to-destructive/60 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
            <span className="text-primary-foreground font-serif type-body font-semibold">
              MD
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground type-body-small leading-tight font-semibold">
              {t("marketing__showpiece__person_name")}
            </p>
            <p className="text-muted-foreground type-caption mt-0.5">
              {t("marketing__showpiece__person_role")}
            </p>
          </div>
        </div>

        <blockquote className="text-foreground/80 mt-4 font-serif type-body-small leading-relaxed italic">
          {t("marketing__showpiece__quote")}
        </blockquote>
        <HeroAudioLazy />
      </Card>

      <Card className="absolute right-4 bottom-10 z-2 w-44 rotate-[7deg] overflow-hidden rounded-2xl shadow-xl">
        <div className="from-primary to-primary/60 relative flex h-32 items-center justify-center bg-linear-to-br">
          <span className="text-primary-foreground/80 type-display font-semibold italic">
            J
          </span>
        </div>
        <div className="p-3">
          <p className="text-muted-foreground type-caption font-medium">
            {t("marketing__showpiece__caption_joan")}
          </p>
        </div>
      </Card>
    </div>
  );
};
