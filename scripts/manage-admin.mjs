// Admin account management. LOCAL DEVELOPMENT DATABASE ONLY (for now).
//
//   npm run admin
//
// No admin yet:   creates the one admin account (email, name, password).
// Admin exists:   change its email, or reset its password. Either change signs the admin
//                 out everywhere (all sessions are deleted).
//
// Run it in PowerShell, Command Prompt or Windows Terminal. Passwords are typed hidden and
// are never printed, logged or saved anywhere except as a scrypt hash in the database.
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

// Local database only
const connectionString = process.env.DATABASE_URL;
if (!connectionString) fail("DATABASE_URL is not set. Copy .env.example to .env first.");
if (process.env.NODE_ENV === "production" || !["localhost", "127.0.0.1", "::1"].includes(new URL(connectionString).hostname)) {
  fail("Refusing to run: this script only works against a local development database.");
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
