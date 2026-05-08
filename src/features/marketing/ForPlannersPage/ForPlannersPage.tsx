import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";
import { Button } from "@peja/ui/components/Button";
import { appRoutes } from "@/lib/routes";
import { Link } from "@/i18n/navigation";
import { ForPlannersBenefit } from "./ForPlannersBenefit";
import { FOR_PLANNERS_BENEFIT_KEYS } from "./constants";

export const ForPlannersPage = () => {
  const t = useTranslations();

  const benefits = FOR_PLANNERS_BENEFIT_KEYS.map((k) => ({ title: t(k.title), body: t(k.body) }));

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__for_planners__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">{t("marketing__for_planners__title_line1")}</span>
            <span className="text-primary block italic">{t("marketing__for_planners__title_line2")}</span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__for_planners__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
            {benefits.map((b) => (
              <ForPlannersBenefit key={b.title} title={b.title} body={b.body} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href={appRoutes.auth.signUp}>{t("marketing__for_planners__cta")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={appRoutes.marketing.howItWorks}>{t("marketing__for_planners__cta_secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
