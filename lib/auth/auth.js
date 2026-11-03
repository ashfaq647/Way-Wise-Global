import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/validations/auth";

// Better Auth configuration for the admin panel (one admin account, email + password).
// Secrets come from .env: BETTER_AUTH_SECRET signs cookies, BETTER_AUTH_URL is the app's
// own address (only requests from that origin may sign in).
//
// Cookies use Better Auth's defaults: httpOnly and SameSite=Lax always; Secure (with the
// __Secure- prefix) whenever BETTER_AUTH_URL starts with https://, i.e. in production.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    // No public registration. The one admin account is managed with `npm run admin`.
    disableSignUp: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
  },

  // Sessions are stored in the PostgreSQL "session" table; signing out deletes the row.
  session: {
    expiresIn: 60 * 60 * 12, // 12 hours
    updateAge: 60 * 60, // extend an active session at most once an hour
  },

  // Login-attempt limit (on by default only in production; enabled here everywhere).
  // Counters are kept in the database so they survive restarts. Locally all clients share
  // one counter; production needs advanced.ipAddress set for the hosting platform.
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      // 5 sign-in attempts, then every attempt (even with the right password) is blocked
      // until 2 minutes after the last allowed one
      "/sign-in/email": { window: 2 * 60, max: 5 },
    },
  },

  telemetry: { enabled: false },

  // Lets Server Actions (sign out) set and clear cookies. Must be the last plugin.
  plugins: [nextCookies()],
});
