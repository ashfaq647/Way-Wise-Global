import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

// The real access check for the admin panel. It reads the session cookie and looks the
// session up in the database (a cookie alone proves nothing). proxy.js only does a quick
// cookie-exists redirect in front of this.
//
// There is exactly one account (sign-up is disabled and a second user can't be created),
// so a valid session means the admin.

// cache(): one database lookup per request, however many functions ask.
export const getAdminSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ? session : null;
});

// For pages and the data layer: returns the session or sends the visitor to the login page.
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
