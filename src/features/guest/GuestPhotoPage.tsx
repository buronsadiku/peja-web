import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { GuestWizardShell } from "./shell/GuestWizardShell";
import { PhotoClient } from "./photo/PhotoClient";

type GuestPhotoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestPhotoPage = async ({
  params,
  searchParams,
}: GuestPhotoPageProps) => {
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

  if (!event.kiosk.capturePhoto) {
    redirect(`/g/${slug}/review`);
  }

  return (
    <GuestWizardShell event={event}>
      <PhotoClient
        slug={slug}
        exitPin={event.kiosk.exitPin}
        fullscreenLock={event.kiosk.fullscreenLock}
        sourceParam={sourceParam}
      />
    </GuestWizardShell>
  );
};
