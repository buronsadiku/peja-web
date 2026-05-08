import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";
import { Button } from "@peja/ui/components/Button";

export const PressKitPage = () => {
  const t = useTranslations();

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__press_kit__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4">
            {t("marketing__press_kit__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__press_kit__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="grid grid-cols-1 gap-8 tablet:grid-cols-3">
            <div>
              <p className="text-muted-foreground type-body-small font-semibold uppercase tracking-widest">
                {t("marketing__press_kit__boilerplate_label")}
              </p>
              <div className="border-border bg-card rounded-16 mt-4 border p-6">
                <p className="text-muted-foreground type-body leading-relaxed">
                  {t("marketing__press_kit__boilerplate")}
                </p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground type-body-small font-semibold uppercase tracking-widest">
                {t("marketing__press_kit__contact_label")}
              </p>
              <a
                href={`mailto:${t("marketing__press_kit__contact_email")}`}
                className="text-primary type-body mt-4 inline-block font-semibold underline underline-offset-4"
              >
                {t("marketing__press_kit__contact_email")}
              </a>
            </div>

            <div>
              <p className="text-muted-foreground type-body-small font-semibold uppercase tracking-widest">
                {t("marketing__press_kit__assets_label")}
              </p>
              <p className="text-muted-foreground type-body mt-4 leading-relaxed">
                {t("marketing__press_kit__assets_description")}
              </p>
              <Button className="mt-4" asChild>
                <a href="#">{t("marketing__press_kit__download")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
