import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@peja/ui/components/Button";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { Link } from "@/i18n/navigation";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { StickyCTA } from "./shell/StickyCTA";
import { LandingSteps } from "./landing/LandingSteps";
import { TrustNote } from "./landing/TrustNote";
import { InvitationOpenTracker } from "./InvitationOpenTracker";

type GuestLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestLandingPage = async ({ params }: GuestLandingPageProps) => {
  const { slug } = await params;
  const t = await getTranslations();

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  const canSubmit = event.submissionOpen && !event.limitReached;
  const closedMessage = event.limitReached
    ? t("guest__landing__closed_limit")
    : !event.submissionOpen
      ? t("guest__landing__closed_not_open")
      : t("guest__landing__closed_other");

  return (
    <GuestWizardShell event={event}>
      <InvitationOpenTracker slug={slug} />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-9">
          <LandingSteps />
          <TrustNote message={t("guest__landing__trust_note")} />
        </div>
        {canSubmit ? (
          <StickyCTA caption={t("guest__landing__cta_caption")}>
            <Button
              asChild
              size="lg"
              className="w-full rounded-full shadow-lg"
            >
              <Link href={`/g/${slug}/compose`}>
                {t("guest__landing__cta_record")}
                <ArrowRightIcon width={16} height={16} />
              </Link>
            </Button>
          </StickyCTA>
        ) : (
          <StickyCTA>
            <div className="rounded-16 bg-warm-cream border-border border p-4_5">
              <p className="type-body-small text-foreground/85 text-center">
                {closedMessage}
              </p>
            </div>
          </StickyCTA>
        )}
      </div>
    </GuestWizardShell>
  );
};
