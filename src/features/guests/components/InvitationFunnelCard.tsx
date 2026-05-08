import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import type { InvitationStats } from "@/lib/api/types";

type InvitationFunnelCardProps = {
  invitations: InvitationStats;
};

const conversionRate = (numerator: number, denominator: number): string => {
  if (!denominator) return "—";
  return `${Math.round((numerator / denominator) * 100)}%`;
};

const channelKey = (channel: string): string => {
  switch (channel) {
    case "whatsapp":
      return "guests__funnel__channel__whatsapp";
    case "email":
      return "guests__funnel__channel__email";
    case "sms":
      return "guests__funnel__channel__sms";
    case "link":
      return "guests__funnel__channel__link";
    case "qr_print":
      return "guests__funnel__channel__qr_print";
    case "ig_story":
      return "guests__funnel__channel__ig_story";
    default:
      return "";
  }
};

export const InvitationFunnelCard = ({
  invitations,
}: InvitationFunnelCardProps) => {
  const t = useTranslations();
  const channels = Object.entries(invitations.byChannel)
    .filter(([, stats]) => stats && stats.sent > 0)
    .sort((a, b) => (b[1]?.sent ?? 0) - (a[1]?.sent ?? 0));

  const totals = invitations.totals;

  return (
    <div className="rounded-16 border-border bg-card border p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <Kicker className="text-muted-foreground">
            {t("guests__funnel__eyebrow")}
          </Kicker>
          <p className="type-body mt-1.5 font-serif font-semibold">
            {t("guests__funnel__title")}
          </p>
        </div>
        <div className="type-caption text-muted-foreground">
          {t("guests__funnel__totals", {
            sent: totals.sent,
            opened: totals.opened,
            submitted: totals.submitted,
          })}
        </div>
      </div>

      {channels.length === 0 ? (
        <p className="type-body-small text-muted-foreground mt-5">
          {t("guests__funnel__empty")}
        </p>
      ) : (
        <div className="mt-5 grid gap-3">
          {channels.map(([channel, stats]) => {
            if (!stats) return null;
            const labelKey = channelKey(channel);
            const label = labelKey ? t(labelKey) : channel;
            return (
              <div
                key={channel}
                className="rounded-12 border-border grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border p-4"
              >
                <span className="type-body-small font-semibold">{label}</span>
                <span className="type-caption text-muted-foreground">
                  {t("guests__funnel__sent", { count: stats.sent })}
                </span>
                <span className="type-caption text-muted-foreground">
                  {t("guests__funnel__opened", {
                    percent: conversionRate(stats.opened, stats.sent),
                  })}
                </span>
                <span className="type-caption text-primary font-semibold">
                  {t("guests__funnel__replied", {
                    percent: conversionRate(stats.submitted, stats.sent),
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
