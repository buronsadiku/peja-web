import { useTranslations } from "next-intl";

type DashboardGreetingProps = {
  name: string;
  date: string;
  venue: string;
  newMessages: number;
};

export const DashboardGreeting = ({
  name,
  date,
  venue,
  newMessages,
}: DashboardGreetingProps) => {
  const t = useTranslations();
  const subtitle = [date, venue].filter(Boolean).join(" \u00b7 ");
  return (
    <div className="tablet:mb-12 mb-8">
      {subtitle && (
        <p className="type-body-small text-muted-foreground">{subtitle}</p>
      )}
      <h1 className="tablet:type-display type-h0 mt-3 max-w-205 leading-[1.05] font-semibold tracking-tight">
        {t("dashboard__greeting", { name })}
      </h1>
      <p className="type-h4 text-muted-foreground mt-3.5 max-w-160 leading-snug font-normal">
        {newMessages > 0
          ? t.rich("dashboard__greeting_lead", {
              count: newMessages,
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })
          : t("dashboard__greeting_lead_empty")}
      </p>
    </div>
  );
};
