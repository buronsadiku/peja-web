import { redirect } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { SettingsProfileSection } from "./components/SettingsProfileSection";

export const SettingsProfilePage = async () => {
  const [user, eventsPage] = await Promise.all([
    getCurrentUser(),
    eventsApi.list({ limit: 1 }),
  ]);
  if (!user) redirect(appRoutes.auth.signIn);
  const event = eventsPage.items[0] ?? null;

  return <SettingsProfileSection user={user} event={event} />;
};
