import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { isPublicRoute, getAuthenticatedRedirectUrl } from "@/utils/routeUtils";

const PUBLIC_FILE = /\.(.*)$/;

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Ignore public files and API routes
    if (pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
      return NextResponse.next();
    }

    // Allow access to public routes (login, register, and employee-login)
    if (isPublicRoute(pathname) || pathname === "/employee-login") {
      // If user is already logged in and trying to access login/register, redirect to dashboard
      if (token && (pathname === "/login" || pathname === "/employee-login")) {
        return NextResponse.redirect(
          new URL(getAuthenticatedRedirectUrl(), request.url)
        );
      }
      return NextResponse.next();
    }

    // All other routes require authentication - NextAuth will handle this
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes (login, register, and employee-login)
        if (isPublicRoute(pathname) || pathname === "/employee-login") {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
