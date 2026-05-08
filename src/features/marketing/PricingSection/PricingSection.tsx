import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { SectionTitle } from "../../../components/SectionTitle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@peja/ui/components/Tabs";
import { PricingCard } from "./PricingCard";
import { COUPLES_TIERS, PRO_TIERS } from "./constants";

export const PricingSection = () => {
  const t = useTranslations();

  return (
    <section className="bg-card border-border border-t">
      <div className="section-container">
        <div className="mb-10 text-center">
          <Kicker className="text-muted-foreground mb-4">
            {t("marketing__pricing__eyebrow")}
          </Kicker>
          <SectionTitle>{t("marketing__pricing__title")}</SectionTitle>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
            {t("marketing__pricing__subtitle")}
          </p>
        </div>

        <Tabs defaultValue="couples" className="items-center">
          <TabsList className="mb-10">
            <TabsTrigger value="couples">
              {t("marketing__pricing__tab_couples")}
            </TabsTrigger>
            <TabsTrigger value="professionals">
              {t("marketing__pricing__tab_professionals")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="couples">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 tablet:grid-cols-2">
              {COUPLES_TIERS.map(({ key, ...tier }) => (
                <PricingCard key={key} {...tier} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="professionals">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 tablet:grid-cols-2">
              {PRO_TIERS.map(({ key, ...tier }) => (
                <PricingCard key={key} {...tier} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
