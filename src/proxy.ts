import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS } from "./constants/cookies.constants";
import { User } from "./interfaces/user.interface";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value;
  const userCookie = request.cookies.get(COOKIE_KEYS.USER)?.value;

  let user: User | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as User;
    } catch {
      user = null;
    }
  }

  const isAuthRoute = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");

  // Protect Admin & Portal routes
  if ((isAdminRoute || isPortalRoute) && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from Auth pages
  if (isAuthRoute && token) {
    const target =
      user?.isStaff || user?.roles?.includes("SUPER_ADMIN")
        ? "/admin"
        : "/portal";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Role scoping
  if (token && user) {
    if (isAdminRoute && !user.isStaff && !user.roles?.includes("SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    if (isPortalRoute && user.isStaff && !user.isBeneficiary) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|verify|static).*)"],
};
