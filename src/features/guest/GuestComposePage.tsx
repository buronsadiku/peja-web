import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { ComposeClient } from "./compose/ComposeClient";

type GuestComposePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestComposePage = async ({
  params,
  searchParams,
}: GuestComposePageProps) => {
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
      <ComposeClient
        slug={slug}
        captureAudio={event.kiosk.captureAudio}
        captureVideo={event.kiosk.captureVideo}
        capturePhoto={event.kiosk.capturePhoto}
        maxDurationSec={event.kiosk.maxDurationSeconds}
        exitPin={event.kiosk.exitPin}
        fullscreenLock={event.kiosk.fullscreenLock}
        sourceParam={sourceParam}
      />
    </GuestWizardShell>
  );
};
