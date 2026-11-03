// Development seed (npm run db:seed). LOCAL DEVELOPMENT DATABASE ONLY.
//
// It no longer adds any inquiries: the 7 placeholder sample inquiries were removed so the
// admin panel shows only real submissions, and this script never recreates them. It is kept
// (with its local-only safety checks) so `npm run db:seed` and the seed setting in
// prisma.config.mjs keep working if development data is needed again later.
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env first.");
  process.exit(1);
}

// Refuse to touch anything that isn't a database on this machine.
const { hostname } = new URL(connectionString);
if (process.env.NODE_ENV === "production" || !["localhost", "127.0.0.1", "::1"].includes(hostname)) {
  console.error("Refusing to seed: the seed script only runs against a local development database.");
  process.exit(1);
}

console.log("[dev seed] Nothing to seed: sample inquiries are no longer created. The database was not changed.");
