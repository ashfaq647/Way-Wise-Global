import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client.ts";

// One Prisma Client for the whole server. In development, Next.js re-runs modules on every
// change, so the client is kept on globalThis to avoid opening a new connection pool each time.
const globalForPrisma = globalThis;

// The app prefers the pooled connection (DATABASE_URL_POOLED, e.g. Neon's "-pooler" URL on
// Vercel, where many short-lived functions connect at once) and falls back to DATABASE_URL,
// the direct connection that the Prisma CLI uses (and the only one in local development).
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL_POOLED?.trim() || process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("Neither DATABASE_URL_POOLED nor DATABASE_URL is set. Copy .env.example to .env.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
