
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = new Set([
    "/",
    "/signin",
    "/register",
    "/otp",
    "/favicon.ico",
  ]);

  // Allow static files and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  if (publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const expiresCookie = request.cookies.get("auth_token_expires")?.value ?? null;
  let isExpired = false;
  if (expiresCookie) {
    const ms = Date.parse(expiresCookie);
    if (!Number.isNaN(ms)) {
      isExpired = Date.now() >= ms;
    }
  }

  const isUserRoute = /^\/[A-Za-z0-9-]+(\/.*)?$/.test(pathname); // match /1/home, /john/profile, dll
  const isProfile = /^\/[A-Za-z0-9-]+\/profile$/.test(pathname);
  console.log(token);
  if ((isUserRoute || isProfile) && (!token || isExpired)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:id/:path*",
  ],
};

