import "server-only";
import { NextResponse } from "next/server";
import { auth } from "./config";

export const requireAdminApi = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { message: "unauthorized" },
        { status: 401 },
      ),
    };
  }
  return { session, response: null };
};
