import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware untuk authentication dan route protection (JWT-based)
 * 
 * Protected routes: semua route kecuali /login, /api/auth/login, dan public assets
 * Redirect ke /login jika belum auth
 * Redirect ke /dashboard jika sudah auth tapi akses /login
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-change-in-production-please-min-32-chars"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Public API routes
  const publicApiRoutes = ["/api/auth/login"];
  const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));

  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Get token dari cookie
  const token = req.cookies.get("auth-token");
  let hasSession = false;

  if (token) {
    try {
      await jwtVerify(token.value, JWT_SECRET);
      hasSession = true;
    } catch (error) {
      // Token invalid atau expired
      hasSession = false;
    }
  }

  // Redirect ke /login jika belum auth dan akses protected route
  if (!hasSession && !isPublicRoute) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect ke /dashboard jika sudah auth tapi akses login page
  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
