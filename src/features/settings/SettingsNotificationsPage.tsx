import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { SettingsNotificationsSection } from "./components/SettingsNotificationsSection";

export const SettingsNotificationsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  return <SettingsNotificationsSection user={user} />;
};
