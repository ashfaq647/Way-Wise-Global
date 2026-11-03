import { z } from "zod";

// Admin password length rules, used by the Better Auth config (lib/auth/auth.js) and the
// admin account script (scripts/manage-admin.mjs).
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

// Admin account fields, validated by scripts/manage-admin.mjs
export const adminEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, { error: "Enter a valid email address." })
  .pipe(z.email({ error: "Enter a valid email address." }));

export const adminNameSchema = z
  .string()
  .trim()
  .min(1, { error: "Enter a name." })
  .max(100, { error: "Name must be 100 characters or fewer." });

export const adminPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  .max(PASSWORD_MAX_LENGTH, { error: `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.` });

export const adminAccountSchema = z.object({
  email: adminEmailSchema,
  name: adminNameSchema,
  password: adminPasswordSchema,
});
