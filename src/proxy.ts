import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];
const ROLE_SELECT_ROUTE = "/role-select";
const ONBOARDING_PREFIX = "/onboarding";
const PROTECTED_PREFIXES = ["/dashboard", "/briefs", "/discover", "/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user, role, onboarded } = await updateSession(request);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isRoleSelect = pathname === ROLE_SELECT_ROUTE;
  const isOnboarding = pathname.startsWith(ONBOARDING_PREFIX);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL(
        !role
          ? ROLE_SELECT_ROUTE
          : !onboarded
            ? `${ONBOARDING_PREFIX}/${role}`
            : "/dashboard",
        request.url,
      ),
    );
  }

  if (isRoleSelect) {
    if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));
    if (role && !onboarded)
      return NextResponse.redirect(
        new URL(`${ONBOARDING_PREFIX}/${role}`, request.url),
      );
    if (role && onboarded)
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isOnboarding) {
    if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));
    if (!role)
      return NextResponse.redirect(new URL(ROLE_SELECT_ROUTE, request.url));
    if (onboarded)
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtected) {
    if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));
    if (!role)
      return NextResponse.redirect(new URL(ROLE_SELECT_ROUTE, request.url));
    if (!onboarded)
      return NextResponse.redirect(
        new URL(`${ONBOARDING_PREFIX}/${role}`, request.url),
      );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
