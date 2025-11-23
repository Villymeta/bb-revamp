import { NextResponse } from "next/server";

const ADMIN_PATH = "/admin";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith(ADMIN_PATH)) return NextResponse.next();

  const adminCookie = req.cookies.get("bob_admin_authed")?.value;

  // If not logged in and not on /admin/login, redirect
  if (!adminCookie && pathname !== "/admin/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};