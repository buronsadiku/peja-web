import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { eventsApi } from "@/lib/api/events";
import { plansApi } from "@/lib/api/plans";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { appRoutes } from "@/lib/routes";
import { ActivateLinkPicker } from "./components/ActivateLinkPicker";

export const ActivateLinkPage = async () => {
  noStore();
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) redirect(appRoutes.app.root);

  const subResult = await subscriptionsApi.get(event.id).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (subResult?.subscription) redirect(appRoutes.app.root);

  const { plans } = await plansApi.list();

  return <ActivateLinkPicker eventId={event.id} plans={plans} />;
};
