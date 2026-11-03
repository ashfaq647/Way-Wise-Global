"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { auth } from "@/lib/auth/auth";

// Signs the admin out: deletes the session row in PostgreSQL and clears the cookie (the
// nextCookies plugin lets a Server Action do that), then goes to the login page.
export async function signOutAdmin() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    unstable_rethrow(error);
    // no valid session: there is nothing to end, so just continue to the login page
  }
  redirect("/admin/login");
}
