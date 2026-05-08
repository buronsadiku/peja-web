import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { SettingsLayout } from "@/features/layout/SettingsLayout/SettingsLayout";

export default async function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  return <SettingsLayout>{children}</SettingsLayout>;
}
