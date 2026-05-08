import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export const proxy = (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return;
    }
    const hasSession = !!getSessionCookie(request, { cookiePrefix: "peja" });
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return Response.redirect(loginUrl);
    }
    return;
  }

  return intlMiddleware(request as never);
};

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
