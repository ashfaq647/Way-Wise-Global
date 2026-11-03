// Admin account management.
//
//   npm run admin                 local development database (DATABASE_URL in .env) only
//   npm run admin -- --remote     a remote database, e.g. Neon for Vercel (see below)
//
// No admin yet:   creates the one admin account (email, name, password).
// Admin exists:   change its email, or reset its password. Either change signs the admin
//                 out everywhere (all sessions are deleted).
//
// Remote mode (--remote): the connection URL is NOT read from .env or the environment; it is
// pasted at a hidden prompt, so it never ends up in a file or the shell history. Use Neon's
// direct URL (host without "-pooler"). Only the host and database name are shown, then you
// must type the database name to continue, and type CREATE ADMIN before an account is
// created. The URL must require TLS (sslmode=require, verify-ca or verify-full).
// Without --remote, every database that isn't on this machine is refused, as before.
//
// Run it in PowerShell, Command Prompt or Windows Terminal. Passwords are typed hidden and
// are never printed, logged or saved anywhere except as a scrypt hash in the database.
// Password hashes don't depend on BETTER_AUTH_SECRET, so an account created from this PC
// can sign in on the deployed site.
import "dotenv/config";
import readline from "node:readline";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client.ts";
import {
  adminAccountSchema,
  adminEmailSchema,
  adminPasswordSchema,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../lib/validations/auth.js";

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];
const SECURE_SSL_MODES = ["require", "verify-ca", "verify-full"];

// The only accepted option is --remote; anything else (e.g. a typo like --remtoe) stops here
const args = process.argv.slice(2);
const unknown = args.filter((arg) => arg !== "--remote");
if (unknown.length) fail(`Unknown option: ${unknown.join(" ")}. Usage: npm run admin  or  npm run admin -- --remote`);
const remote = args.includes("--remote");

// Parses a connection URL. Errors never include the URL itself (it contains the password).
function parseDatabaseUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    fail(`${label} is not a valid connection URL.`);
  }
  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") fail(`${label} must start with postgresql://`);
  return url;
}

// Local mode: DATABASE_URL from .env, and only a database on this machine
let connectionString;
if (!remote) {
  connectionString = process.env.DATABASE_URL;
  if (!connectionString) fail("DATABASE_URL is not set. Copy .env.example to .env first.");
  const { hostname } = parseDatabaseUrl(connectionString, "DATABASE_URL");
  if (process.env.NODE_ENV === "production" || !LOCAL_HOSTS.includes(hostname)) {
    fail("Refusing to run: without --remote this script only works against a local development database.");
  }
}
// A real terminal is needed to type the password without it being shown
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  fail("Run this in PowerShell, Command Prompt or Windows Terminal (an interactive terminal is needed to type passwords hidden).");
}

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (text) => {
      if (!muted) rl.output.write(text);
      else if (text.includes("\n") || text.includes("\r")) rl.output.write("\n");
    };
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    muted = hidden;
  });
}

// Asks for a password twice (hidden) and returns it validated
async function askNewPassword(label) {
  console.log(`Password: ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters. Nothing is shown while you type.`);
  const password = await ask(`${label}: `, { hidden: true });
  if ((await ask("Repeat password: ", { hidden: true })) !== password) fail("The passwords don't match. Nothing was changed.");
  const parsed = adminPasswordSchema.safeParse(password);
  if (!parsed.success) fail(`Nothing was changed: ${parsed.error.issues[0].message}`);
  return parsed.data;
}

// Remote mode: the URL is pasted hidden, checked, and the target confirmed before connecting
let target = null; // { host, database } shown to the user; never the user name or password
if (remote) {
  console.log("\nREMOTE MODE: this changes the admin account of a database that is not on this machine.");
  console.log("Paste the direct connection URL (nothing is shown while you paste), then press Enter.\n");
  connectionString = (await ask("Connection URL: ", { hidden: true })).trim();
  if (!connectionString) fail("No connection URL was entered. Nothing was changed.");
  const url = parseDatabaseUrl(connectionString, "The connection URL");

  if (LOCAL_HOSTS.includes(url.hostname)) fail("This is a local database. Run `npm run admin` without --remote instead.");
  const sslmode = url.searchParams.get("sslmode")?.toLowerCase();
  if (!SECURE_SSL_MODES.includes(sslmode)) {
    fail("The connection URL must require TLS: add ?sslmode=require (Neon's URLs include it). Nothing was changed.");
  }

  target = { host: url.hostname, database: decodeURIComponent(url.pathname.replace(/^\//, "")) };
  if (!target.database) fail("The connection URL has no database name. Nothing was changed.");

  console.log(`\nTarget database\n  Host:     ${target.host}\n  Database: ${target.database}`);
  if (url.hostname.includes("-pooler")) console.log("  Note: this is a pooled URL; the direct URL (without -pooler) is recommended.");
  const typed = await ask(`\nType the database name (${target.database}) to continue: `);
  if (typed.trim() !== target.database) fail("The database name didn't match. Cancelled. Nothing was changed.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Better Auth instance for this script: same database and password hashing as the app
const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: PASSWORD_MIN_LENGTH, maxPasswordLength: PASSWORD_MAX_LENGTH },
  telemetry: { enabled: false },
  logger: { level: "error" },
});

async function createAdmin(ctx) {
  console.log("\nNo admin account exists yet. Let's create it.\n");
  const email = await ask("Admin email: ");
  const name = await ask("Name: ");
  const password = await askNewPassword("Password");

  const parsed = adminAccountSchema.safeParse({ email, name, password });
  if (!parsed.success) fail(`Nothing was changed:\n${parsed.error.issues.map((i) => `  - ${i.message}`).join("\n")}`);

  if (target) {
    console.log(`\nAbout to create the admin account ${parsed.data.email}\n  on ${target.host} / ${target.database}`);
    const typed = await ask("Type CREATE ADMIN to confirm: ");
    if (typed.trim() !== "CREATE ADMIN") fail("Cancelled. Nothing was changed.");
  }

  const user = await ctx.internalAdapter.createUser({ email: parsed.data.email, name: parsed.data.name, emailVerified: true });
  const passwordHash = await ctx.password.hash(parsed.data.password);
  await ctx.internalAdapter.linkAccount({ userId: user.id, providerId: "credential", accountId: user.id, password: passwordHash });
  console.log(`\n✔ Admin account created for ${user.email}. Sign in at /admin/login`);
}

async function changeEmail(ctx, admin) {
  const parsed = adminEmailSchema.safeParse(await ask("New email: "));
  if (!parsed.success) fail(`Nothing was changed: ${parsed.error.issues[0].message}`);
  const email = parsed.data;

  if (email === admin.email) fail("That is already the admin email. Nothing was changed.");
  const taken = await prisma.user.findFirst({ where: { email, NOT: { id: admin.id } }, select: { id: true } });
  if (taken) fail("That email is already used by another account. Nothing was changed.");

  const answer = await ask(`Change ${admin.email} → ${email}? (y/N) `);
  if (answer.trim().toLowerCase() !== "y") fail("Cancelled. Nothing was changed.");

  // The password is linked to the user ID, not the email, so sign-in works with the new
  // email straight away.
  await ctx.internalAdapter.updateUser(admin.id, { email });
  await ctx.internalAdapter.deleteUserSessions(admin.id); // sign out everywhere
  console.log(`\n✔ Admin email changed to ${email}. All sessions were signed out.`);
}

async function resetPassword(ctx, admin) {
  const password = await askNewPassword("New password");
  await ctx.internalAdapter.updatePassword(admin.id, await ctx.password.hash(password));
  await ctx.internalAdapter.deleteUserSessions(admin.id); // sign out everywhere
  console.log(`\n✔ Password updated for ${admin.email}. All sessions were signed out.`);
}

try {
  const ctx = await auth.$context;
  const users = await prisma.user.findMany({ select: { id: true, email: true }, take: 2 });

  if (users.length === 0) {
    await createAdmin(ctx);
  } else {
    // Exactly one admin is allowed; the script never creates a second one.
    if (users.length > 1) fail("More than one user account exists. This project expects exactly one admin.");
    const admin = users[0];
    console.log(`\nAdmin account: ${admin.email}\n\n  1) Change email\n  2) Reset password\n  3) Exit\n`);
    const choice = (await ask("Choose 1–3: ")).trim();
    if (choice === "1") await changeEmail(ctx, admin);
    else if (choice === "2") await resetPassword(ctx, admin);
    else console.log("No changes made.");
  }
} catch (error) {
  console.error("\n✖ Failed:", error?.message ?? error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
  process.exit(process.exitCode ?? 0); // don't wait on the open terminal input
}
