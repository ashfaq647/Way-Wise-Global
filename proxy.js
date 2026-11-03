import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Quick redirect for admin pages (Next.js 16 "proxy", formerly middleware): no session
// cookie, go to the login page. It does not prove the session is valid; the real check is
// requireAdmin() (lib/auth/session.js), which every admin data function runs.
export function proxy(request) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!getSessionCookie(request)) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
