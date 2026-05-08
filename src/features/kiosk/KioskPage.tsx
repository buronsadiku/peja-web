import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { KioskLiveFrame } from "@/features/kiosk-setup/components/KioskLiveFrame";

type KioskPageProps = {
  params: Promise<{ slug: string }>;
};

export const KioskPage = async ({ params }: KioskPageProps) => {
  const { slug } = await params;

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!event) notFound();

  return (
    <div className="fixed inset-0">
      <KioskLiveFrame slug={slug} event={event} enableWakeLock />
    </div>
  );
};
