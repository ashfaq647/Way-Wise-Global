import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, RESET_LINK_MINUTES } from "@/lib/auth/password-rules";
import { sendPasswordResetEmail } from "@/lib/email/password-reset-email";

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

    // Forgot password (/admin/forgot-password → email → /admin/reset-password). Only the
    // email is used here, not the default URL: the link goes to our own reset page.
    // The request always gets the same reply, whether or not the address is the admin's,
    // and the email is sent after the reply (advanced.backgroundTasks below), so the reply
    // time doesn't reveal it either.
    sendResetPassword: async ({ user, token }) => sendPasswordResetEmail({ user, token }),
    resetPasswordTokenExpiresIn: RESET_LINK_MINUTES * 60,
    // A successful reset signs the admin out on every device (all session rows deleted)
    revokeSessionsOnPasswordReset: true,
  },

  // Reset tokens are stored in the "verification" table as a SHA-256 hash, not as-is, so
  // a copy of the database can't be used to reset the password. Each token works once.
  verification: {
    storeIdentifier: "hashed",
  },

  // Sessions are stored in the PostgreSQL "session" table; signing out deletes the row.
  session: {
    expiresIn: 60 * 60 * 12, // 12 hours
    updateAge: 60 * 60, // extend an active session at most once an hour
  },

  // Request rate limits (on by default only in production; enabled here everywhere).
  // Counters are kept in the database so they survive restarts. They are per client IP
  // (advanced.ipAddress below); in local development every client counts as 127.0.0.1.
  // Reset emails also have a per-account limit (lib/email/password-reset-email.js).
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      // 5 sign-in attempts, then every attempt (even with the right password) is blocked
      // until 2 minutes after the last allowed one
      "/sign-in/email": { window: 2 * 60, max: 5 },
      // Change password (Settings) checks the current password, so it gets the same limit
      // against guessing it (Better Auth's default here is 3 per 10 seconds)
      "/change-password": { window: 2 * 60, max: 5 },
      // Forgot password: 3 reset requests a minute (Better Auth's default, stated here)
      "/request-password-reset": { window: 60, max: 3 },
      // Setting the new password with a token (Better Auth's default: 100 per 10 seconds)
      "/reset-password": { window: 2 * 60, max: 5 },
    },
  },

  advanced: {
    // Emails (the reset link) are sent after the response with Next.js after(): the
    // request returns at once, whether or not an email is sent and however slow the
    // SMTP server is. after() hands the work to the platform's waitUntil (Vercel keeps
    // the function running until it finishes), so it is not dropped when the response ends.
    backgroundTasks: { handler: (task) => after(task) },

    // Client IP for the rate limits. Vercel sets x-forwarded-for (a single value it
    // overwrites, so clients can't fake it) and x-real-ip. Better Auth trusts a header only
    // when it holds exactly one address; behind another proxy, set trustedProxies instead.
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },

  telemetry: { enabled: false },

  // Lets Server Actions (sign out) set and clear cookies. Must be the last plugin.
  plugins: [nextCookies()],
});
