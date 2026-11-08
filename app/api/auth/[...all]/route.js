import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

// Better Auth's HTTP endpoints. The admin panel only needs sign-in, sign-out, the two
// forgot-password steps (ask for a reset email, set the new password with its token) and
// change password (Settings; needs a valid session and the current password). Every other
// Better Auth endpoint (sign-up, email changes, the GET reset-link redirect, …) answers 404.
const ALLOWED_POST = new Set([
  "/api/auth/sign-in/email",
  "/api/auth/sign-out",
  "/api/auth/request-password-reset",
  "/api/auth/reset-password",
  "/api/auth/change-password",
]);

const handler = toNextJsHandler(auth);
const notFound = () => Response.json({ message: "Not found" }, { status: 404 });

export function GET() {
  return notFound();
}

export function POST(request) {
  const path = new URL(request.url).pathname.replace(/\/+$/, "");
  return ALLOWED_POST.has(path) ? handler.POST(request) : notFound();
}
