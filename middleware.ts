import { getCurrentUser } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ["/login", "/register"];
const commonPrivateRoutes = ["/profile", "/change-password"];

const roleBasedPrivateRoutes = {
  admin: [/^\/dashboard\/admin/, /^\/api\/admin/],
  landlord: [
    /^\/dashboard\/landlord/,
    /^\/listings\/create/,
    /^\/api\/landlord/,
  ],
  tenant: [/^\/dashboard\/tenant/, /^\/api\/tenant/],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const userInfo = await getCurrentUser();

  // Not logged in
  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `http://localhost:3000/login?redirectPath=${pathname}`,
          request.url
        )
      );
    }
  }

  // Logged in user
  const isCommonPrivateRoute = commonPrivateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const role = userInfo.role as Role;
  const allowedPatterns = roleBasedPrivateRoutes[role] || [];

  const isRoleBasedRoute = allowedPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (isCommonPrivateRoute || isRoleBasedRoute) {
    return NextResponse.next();
  }

  // Unauthorized
  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/listings/create",
    "/profile",
    "/change-password",
    "/api/:path*",
  ],
};
