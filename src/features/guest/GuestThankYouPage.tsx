import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@peja/ui/components/Button";
import { HeartIcon } from "@peja/icons/HeartIcon";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { Link } from "@/i18n/navigation";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { StickyCTA } from "./shell/StickyCTA";

type GuestThankYouPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestThankYouPage = async ({
  params,
  searchParams,
}: GuestThankYouPageProps) => {
  const { slug } = await params;
  const search = await searchParams;
  const isKioskSession = search.source === "kiosk";
  const t = await getTranslations();

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  const names = `${event.partnerAName} & ${event.partnerBName}`;
  const canSubmitAnother = event.submissionOpen && !event.limitReached;

  return (
    <GuestWizardShell event={event}>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-9">
          <div className="bg-card/65 border-border rounded-16 flex flex-col items-center gap-5 border p-6 text-center backdrop-blur-sm tablet:p-8">
            <div className="bg-destructive/15 rounded-20 flex size-16 items-center justify-center">
              <HeartIcon
                width={28}
                height={28}
                className="fill-destructive text-destructive"
              />
            </div>
            <div>
              <p className="type-overline text-muted-foreground tracking-wider">
                {t("guest__thank_you__eyebrow")}
              </p>
              <h2 className="type-h2 mt-2.5 leading-tight font-semibold tracking-tight">
                {t.rich("guest__thank_you__title", {
                  names,
                  emph: (chunks) => (
                    <span className="text-primary italic">{chunks}</span>
                  ),
                })}
              </h2>
              <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
                {t("guest__thank_you__body")}
              </p>
            </div>
          </div>

          <div className="bg-card/65 border-border rounded-16 border p-4 backdrop-blur-sm">
            <p className="type-caption text-muted-foreground text-center leading-relaxed">
              {t("guest__thank_you__caption")}
            </p>
          </div>
        </div>

        {canSubmitAnother && !isKioskSession && (
          <StickyCTA>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full"
            >
              <Link href={`/g/${slug}/compose`}>
                {t("guest__thank_you__cta")}
                <ArrowRightIcon width={16} height={16} />
              </Link>
            </Button>
          </StickyCTA>
        )}
      </div>
    </GuestWizardShell>
  );
};
