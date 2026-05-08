import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { Badge } from "@peja/ui/components/Badge";
import { SettingsRow } from "./SettingsRow";

type PastExportRowProps = {
  date: string;
  title: string;
  size: string;
  status: "ready" | "expired";
  last?: boolean;
};

export const PastExportRow = ({
  date,
  title,
  size,
  status,
  last,
}: PastExportRowProps) => {
  const t = useTranslations();
  return (
    <SettingsRow
      title={
        <span className="inline-flex items-center gap-3">
          {title}
          <Badge variant={status === "ready" ? "secondary" : "outline"}>
            {status === "ready"
              ? t("settings__data__past__status_ready")
              : t("settings__data__past__status_expired")}
          </Badge>
        </span>
      }
      description={`${date} \u00b7 ${size}`}
      last={last}
    >
      {status === "ready" ? (
        <Button size="sm" className="rounded-full">
          {t("settings__data__download")}
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="rounded-full">
          {t("settings__data__past__regenerate")}
        </Button>
      )}
    </SettingsRow>
  );
};
