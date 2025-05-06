import { getCurrentUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export const protectedRoutes = [
  "/dashboard",
  "/dashboard/:path*",
  "/listings/create",
  "/profile",
  "/change-password",
  "/admin/:path*",
  "/landlord/:path*",
  "/tenant/:path*",
];

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

  // ✅ Public routes
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static");

  // Make listing detail pages public (matches /listings/123 pattern but not /listings/create)
  const isListingDetailPage =
    pathname.startsWith("/listings/") && pathname !== "/listings/create";

  // Allow public access to listing detail pages
  if (isPublicRoute || isListingDetailPage) {
    return NextResponse.next();
  }

  const userInfo = await getCurrentUser();

  // ❌ Not logged in trying to access protected routes
  const isCommonPrivateRoute = commonPrivateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isRoleBasedRoute = Object.values(roleBasedPrivateRoutes).some(
    (patterns) => patterns.some((pattern) => pattern.test(pathname))
  );

  if (!userInfo && (isCommonPrivateRoute || isRoleBasedRoute)) {
    return NextResponse.redirect(
      new URL(`/login?redirectPath=${pathname}`, request.url)
    );
  }

  // ✅ Logged in user — check role-based access
  if (userInfo) {
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
