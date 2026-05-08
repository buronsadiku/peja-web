import { redirect } from "next/navigation";
import { appRoutes } from "@/lib/routes";

export const AccountPage = () => {
  redirect(appRoutes.app.settings);
};
