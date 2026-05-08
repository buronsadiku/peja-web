import { useTranslations } from "next-intl";
import { ContributionRingIllustration } from "@peja/illustrations/ContributionRing";

type ContributionRingProps = {
  value: number;
  total: number;
};

export const ContributionRing = ({ value, total }: ContributionRingProps) => {
  const t = useTranslations();
  const pct = value / total;

  return (
    <div className="rounded-20 border-border bg-card flex w-55 flex-col items-center border p-5 shadow">
      <ContributionRingIllustration
        pct={pct}
        centerLabel={`${Math.round(pct * 100)}%`}
        ringLabel={t("guests__contribution_ring__label")}
      />
      <p className="type-caption text-muted-foreground mt-1 text-center">
        {t.rich("guests__contribution_ring__copy", {
          value,
          total,
          strong: (chunks) => (
            <strong className="text-foreground">{chunks}</strong>
          ),
        })}
      </p>
    </div>
  );
};
