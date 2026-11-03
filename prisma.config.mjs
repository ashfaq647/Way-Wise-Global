// Prisma CLI configuration (Prisma ORM 7). Prisma 7 doesn't read .env by itself, so
// dotenv loads it here. Local development only: DATABASE_URL points at the Docker database.
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
