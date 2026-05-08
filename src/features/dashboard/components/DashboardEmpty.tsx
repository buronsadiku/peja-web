import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type DashboardEmptyProps = {
  userName: string;
};

export const DashboardEmpty = ({ userName }: DashboardEmptyProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card flex flex-col items-start gap-5 border p-8">
      <Kicker className="text-primary">
        {t("dashboard__empty__eyebrow")}
      </Kicker>
      <h1 className="type-h1 leading-tight font-semibold tracking-tight">
        {t("dashboard__empty__title", { name: userName })}
      </h1>
      <p className="type-body-small text-muted-foreground max-w-180 leading-relaxed">
        {t("dashboard__empty__body")}
      </p>
      <Button
        asChild
        size="lg"
        className="shadow-primary/40 rounded-full shadow-md"
      >
        <Link href={appRoutes.auth.signUpStep(3)}>
          {t("dashboard__empty__cta")}
        </Link>
      </Button>
    </div>
  );
};
