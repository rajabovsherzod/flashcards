// client/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get refresh token from cookies (more reliable than access token)
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!refreshToken;

  // Public routes that don't require authentication
  const isPublicRoute = pathname === "/";

  // Protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/decks") ||
    pathname.startsWith("/study");

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
