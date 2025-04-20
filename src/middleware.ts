import { getCurrentUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

type Role = keyof typeof roleBasedPrivateRoutes;

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/login",
  "/register",
  "/listings",
];

const commonPrivateRoutes = ["/profile", "/change-password"];

const roleBasedPrivateRoutes = {
  admin: [/^\/dashboard\/admin/, /^\/api\/admin/],
  landlord: [
    /^\/dashboard\/landlord/,
    /^\/listings\/create/, // Only landlord can create
    /^\/api\/landlord/,
  ],
  tenant: [/^\/dashboard\/tenant/, /^\/api\/tenant/],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // ✅ Public routes (excluding listing details)
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const userInfo = await getCurrentUser();

  // Check if this is a listing detail page (matches /listings/123 pattern)
  const isListingDetailPage =
    pathname.startsWith("/listings/") && pathname !== "/listings/create";

  // ❌ Not logged in trying to access protected routes (including listing details)
  const isCommonPrivateRoute = commonPrivateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isRoleBasedRoute = Object.values(roleBasedPrivateRoutes).some(
    (patterns) => patterns.some((pattern) => pattern.test(pathname))
  );

  if (
    !userInfo &&
    (isCommonPrivateRoute || isRoleBasedRoute || isListingDetailPage)
  ) {
    return NextResponse.redirect(
      new URL(`/login?redirectPath=${pathname}`, request.url)
    );
  }

  // ✅ Logged in user — check role-based access
  if (userInfo) {
    // For listing details, any logged-in user can access
    if (isListingDetailPage) {
      return NextResponse.next();
    }

    const role = userInfo.role as Role;
    const allowedPatterns = roleBasedPrivateRoutes[role] || [];

    const isAllowed =
      isCommonPrivateRoute ||
      allowedPatterns.some((pattern) => pattern.test(pathname));

    if (isAllowed) {
      return NextResponse.next();
    }

    // ❌ Logged in but unauthorized
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Fallback allow
  return NextResponse.next();
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listings/:path*",
    "/profile",
    "/change-password",
    "/api/:path*",
  ],
};
