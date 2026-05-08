import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./config";

export const getSession = async () => {
  return auth.api.getSession({ headers: await headers() });
};

export const requireAdmin = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
};
