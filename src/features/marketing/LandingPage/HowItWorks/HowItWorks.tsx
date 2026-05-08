import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { SectionTitle } from "../../../../components/SectionTitle";
import { HowItWorksStep1 } from "./HowItWorksStep1";
import { HowItWorksStep2 } from "./HowItWorksStep2";
import { HowItWorksStep3 } from "./HowItWorksStep3";
import { HowItWorksStep } from "./HowItWorksStep";

export const HowItWorks = () => {
  const t = useTranslations();

  const steps = [
    {
      number: "01",
      tag: t("marketing__how__step1_tag"),
      title: t("marketing__how__step1_title"),
      body: t("marketing__how__step1_body"),
      illustration: <HowItWorksStep1 />,
    },
    {
      number: "02",
      tag: t("marketing__how__step2_tag"),
      title: t("marketing__how__step2_title"),
      body: t("marketing__how__step2_body"),
      illustration: <HowItWorksStep2 />,
    },
    {
      number: "03",
      tag: t("marketing__how__step3_tag"),
      title: t("marketing__how__step3_title"),
      body: t("marketing__how__step3_body"),
      illustration: (
        <HowItWorksStep3
          quoteText={t("marketing__how__step3_quote")}
          timeLabel={t("marketing__how__step3_time_label")}
        />
      ),
    },
  ];

  return (
    <section className="bg-card border-border border-t border-b">
      <div className="section-container">
        <div className="mb-14 flex flex-wrap items-end justify-between">
          <div className="max-w-160">
            <Kicker className="text-primary mb-3">
              {t("marketing__how__eyebrow")}
            </Kicker>
            <SectionTitle className="leading-tight">
              {t("marketing__how__title_line1")}
              <br />
              <em className="text-primary">
                {t("marketing__how__title_line2")}
              </em>
            </SectionTitle>
          </div>
          <div className="max-w-90">
            <p className="text-muted-foreground">
              {t("marketing__how__subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {steps.map((step, index) => (
            <HowItWorksStep
              key={step.number}
              number={step.number}
              stepNumber={index + 1}
              tag={step.tag}
              title={step.title}
              body={step.body}
              illustration={step.illustration}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
