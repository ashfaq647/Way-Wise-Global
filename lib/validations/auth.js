import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../auth/password-rules.js";

// Admin password length rules, used by the Better Auth config (lib/auth/auth.js) and the
// admin account script (scripts/manage-admin.mjs). Defined in lib/auth/password-rules.js
// (no imports, so browser forms can use them too) and re-exported here unchanged.
export { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH };

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
