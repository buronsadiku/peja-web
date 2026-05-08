"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { PlanCard } from "../components/PlanCard";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const ChoosePlanStep = () => {
  const t = useTranslations();
  const { updateFormData } = useSignUpStore();
  const router = useRouter();

  const PLANS = [
    {
      id: "essential",
      name: t("signup__plan__essential__name"),
      price: t("signup__plan__essential__price"),
      per: t("signup__plan__essential__per"),
      description: t("signup__plan__essential__description"),
      features: [
        t("signup__plan__essential__feature_1"),
        t("signup__plan__essential__feature_2"),
        t("signup__plan__essential__feature_3"),
      ],
    },
    {
      id: "keepsake",
      name: t("signup__plan__keepsake__name"),
      price: t("signup__plan__keepsake__price"),
      per: t("signup__plan__keepsake__per"),
      description: t("signup__plan__keepsake__description"),
      features: [
        t("signup__plan__keepsake__feature_1"),
        t("signup__plan__keepsake__feature_2"),
        t("signup__plan__keepsake__feature_3"),
        t("signup__plan__keepsake__feature_4"),
      ],
      highlighted: true,
    },
    {
      id: "gold",
      name: t("signup__plan__gold__name"),
      price: t("signup__plan__gold__price"),
      per: t("signup__plan__gold__per"),
      description: t("signup__plan__gold__description"),
      features: [
        t("signup__plan__gold__feature_1"),
        t("signup__plan__gold__feature_2"),
        t("signup__plan__gold__feature_3"),
        t("signup__plan__gold__feature_4"),
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    updateFormData({ selectedPlan: planId });
    router.push(appRoutes.auth.signUpStep(7));
  };

  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-310 px-14 py-14">
        <div className="mb-10 text-center">
          <Kicker className="text-primary">
            {t("auth__signup__eyebrow_step", {
              step: 6,
              label: t("signup__plan__step_label"),
            })}
          </Kicker>
          <h1 className="type-display mt-3.5 leading-tight font-semibold tracking-tight">
            {t("signup__plan__title_a")}{" "}
            <span className="text-primary italic">
              {t("signup__plan__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-140 leading-relaxed">
            {t("signup__plan__subtitle")}
          </p>
        </div>

        <div className="tablet:grid-cols-3 grid gap-4.5">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              per={plan.per}
              description={plan.description}
              features={plan.features}
              highlighted={plan.highlighted}
              onSelect={() => handleSelectPlan(plan.id)}
            />
          ))}
        </div>

        <div className="type-body-small text-muted-foreground mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              updateFormData({ selectedPlan: "essential" });
              router.push(appRoutes.auth.signUpStep(7));
            }}
            className="text-primary cursor-pointer font-semibold"
          >
            {t("signup__plan__skip")}
          </button>
          <span className="mx-3 opacity-30">&middot;</span>
          {t("signup__plan__upgrade_hint")}
        </div>
      </div>
    </div>
  );
};
