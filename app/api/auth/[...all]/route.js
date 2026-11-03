import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

// Better Auth's HTTP endpoints. The admin panel only needs sign-in and sign-out; every
// other Better Auth endpoint (sign-up, password reset, account changes, …) answers 404.
const ALLOWED_POST = new Set(["/api/auth/sign-in/email", "/api/auth/sign-out"]);

const handler = toNextJsHandler(auth);
const notFound = () => Response.json({ message: "Not found" }, { status: 404 });

export function GET() {
  return notFound();
}

export function POST(request) {
  const path = new URL(request.url).pathname.replace(/\/+$/, "");
  return ALLOWED_POST.has(path) ? handler.POST(request) : notFound();
}
