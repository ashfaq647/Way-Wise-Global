// Prisma CLI configuration (Prisma ORM 7). Prisma 7 doesn't read .env by itself, so
// dotenv loads it here (a variable already set in the environment wins over .env).
//
// DATABASE_URL is the DIRECT connection, used only by the CLI (generate, migrate, studio):
//   - local development: the Docker database from .env
//   - Neon: the direct URL (host without "-pooler"); migrations must not go through the pooler
// The app itself connects with DATABASE_URL_POOLED when set (lib/db.js).
// `npm install` runs `prisma generate` (postinstall), which loads this file, so DATABASE_URL
// must also be set wherever the project is installed, e.g. in every Vercel environment.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
