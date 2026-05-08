import { useTranslations } from "next-intl";
import { CheckIcon } from "@peja/icons/CheckIcon";

type StepIndicatorProps = {
  step: number;
};

const STEP_KEYS = [
  "qr_cards_order__step_quantity",
  "qr_cards_order__step_design",
  "qr_cards_order__step_shipping",
  "qr_cards_order__step_payment",
  "qr_cards_order__step_confirm",
] as const;

export const StepIndicator = ({ step }: StepIndicatorProps) => {
  const t = useTranslations();
  const total = STEP_KEYS.length;
  const padded = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="border-border bg-card border-b">
      <div className="tablet:px-10 tablet:py-6 mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <span className="type-h4 font-semibold tracking-tight">
          Peja
        </span>
        <div className="tablet:flex hidden items-center gap-2">
          {STEP_KEYS.map((key, i) => {
            const completed = i < step - 1;
            const active = i === step - 1;
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={
                      "type-caption flex size-5.5 items-center justify-center rounded-full font-bold " +
                      (active
                        ? "bg-primary text-primary-foreground ring-primary/20 ring-4"
                        : completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/7 text-muted-foreground")
                    }
                  >
                    {completed ? (
                      <CheckIcon width={12} height={12} strokeWidth={2.5} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={
                      "type-caption " +
                      (active
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground")
                    }
                  >
                    {t(key)}
                  </span>
                </div>
                {i < total - 1 && <div className="bg-border h-px w-7" />}
              </div>
            );
          })}
        </div>
        <span className="type-caption text-muted-foreground tablet:hidden font-mono">
          {padded(step)} / {padded(total)}
        </span>
      </div>
    </div>
  );
};
