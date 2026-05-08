import "server-only";
import { headers } from "next/headers";
import { auth } from "./better-auth";

export const getServerSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

export const requireServerSession = async () => {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  return session;
};
