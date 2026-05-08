import { redirect } from "next/navigation";
import { appRoutes } from "@/lib/routes";

export const SettingsRootPage = () => {
  redirect(appRoutes.settings.profile);
};
