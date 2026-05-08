import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { ReviewClient } from "./review/ReviewClient";

type GuestReviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestReviewPage = async ({
  params,
  searchParams,
}: GuestReviewPageProps) => {
  const { slug } = await params;
  const search = await searchParams;
  const sourceParam =
    typeof search.source === "string" ? search.source : null;

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  if (!event.submissionOpen || event.limitReached) {
    redirect(`/g/${slug}`);
  }

  return (
    <GuestWizardShell event={event}>
      <ReviewClient
        slug={slug}
        exitPin={event.kiosk.exitPin}
        fullscreenLock={event.kiosk.fullscreenLock}
        capturePhoto={event.kiosk.capturePhoto}
        sourceParam={sourceParam}
      />
    </GuestWizardShell>
  );
};
