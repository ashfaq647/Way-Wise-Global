import { z } from "zod";
import { InquiryStatus } from "@/lib/generated/prisma/enums.ts";
import { INQUIRY_OPPORTUNITIES } from "@/lib/inquiry-options";

// Shared Zod schemas for inquiries. These are the server-side source of truth: every Server
// Action and data function validates its input here before Prisma is called. Client-side
// checks (HTML `required`, etc.) are only a convenience and are never relied on.
//
// Lengths match the column sizes in prisma/schema.prisma, so anything that passes here fits
// in the database.

// ---------------------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------------------

// Allowed statuses, taken from the Prisma enum so the list can't drift from the database.
export const inquiryStatusSchema = z.enum(Object.values(InquiryStatus), {
  error: "Choose a valid status.",
});

// Inquiry IDs come from Prisma's @default(cuid()), which generates CUID v1: a lowercase "c"
// followed by 24 lowercase letters/digits (25 characters). Zod's z.cuid() is deprecated and
// looser, and z.cuid2() would reject these IDs, so the exact format is checked here.
export const inquiryIdSchema = z
  .string({ error: "Invalid inquiry ID." })
  .regex(/^c[a-z0-9]{24}$/, { error: "Invalid inquiry ID." });

// Control characters (newlines, tabs, NUL, bell, …) have no place in single-line fields.
const CONTROL_CHARS = /\p{Cc}/u;
// Multi-line text may contain newlines and tabs, but no other control characters.
const CONTROL_CHARS_EXCEPT_NEWLINES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
// At least one letter or digit, so values made only of spaces or invisible characters fail.
const HAS_VISIBLE_TEXT = /[\p{L}\p{N}]/u;

// Required single-line text: trimmed, 1..max characters, visible, no control characters
const requiredText = (label, max) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, { error: `${label} is required.` })
    .max(max, { error: `${label} must be ${max} characters or fewer.` })
    .refine((value) => !CONTROL_CHARS.test(value), { error: `${label} must be a single line of plain text.` })
    .refine((value) => HAS_VISIBLE_TEXT.test(value), { error: `${label} is required.` });

// Optional multi-line text: trimmed; empty or whitespace-only is stored as null
const optionalMultilineText = (label, max) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label} must be ${max} characters or fewer.` })
    .refine((value) => !CONTROL_CHARS_EXCEPT_NEWLINES.test(value), { error: `${label} contains invalid characters.` })
    .nullish()
    .transform((value) => (value && HAS_VISIBLE_TEXT.test(value) ? value : null));

// Phone: digits plus the usual separators, with 7–15 digits in total (15 is the E.164 maximum)
const phoneSchema = z
  .string({ error: "Phone number is required." })
  .trim()
  .min(1, { error: "Phone number is required." })
  .max(40, { error: "Phone number must be 40 characters or fewer." })
  .refine((value) => /^\+?[\d\s()./-]+$/.test(value), { error: "Enter a valid phone number." })
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    },
    { error: "Enter a valid phone number." },
  );

// Website: optional; if given, a full http(s) address on a real domain name
// (rejects javascript:/data: links, bare hosts like "https://x", localhost and raw IPs)
const websiteSchema = z
  .string()
  .trim()
  .max(300, { error: "Website must be 300 characters or fewer." })
  .nullish()
  .transform((value) => value || null)
  .pipe(
    z
      .url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        error: "Enter a full website address, for example https://example.com.",
      })
      .nullable(),
  );

// ---------------------------------------------------------------------------------------
// Inquiry (mirrors the Prisma `Inquiry` model's user-supplied fields)
// id, reference, status, createdAt and updatedAt are set by the database, never by input.
// ---------------------------------------------------------------------------------------

export const inquirySchema = z.object({
  fullName: requiredText("Full name", 120),
  jobTitle: requiredText("Job title", 120),
  company: requiredText("Company", 160),
  email: z
    .string({ error: "Business email is required." })
    .trim()
    .toLowerCase()
    .max(254, { error: "Email must be 254 characters or fewer." })
    .pipe(z.email({ error: "Enter a valid email address." })),
  phone: phoneSchema,
  website: websiteSchema,
  // One of the dropdown options shown in the public form (lib/inquiry-options.js)
  opportunity: z.enum(INQUIRY_OPPORTUNITIES, { error: "Choose how we can work together." }),
  business: requiredText("Business of interest", 120),
  message: optionalMultilineText("Message", 5000),
});

// ---------------------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------------------

// Admin: change one inquiry's status
export const updateInquiryStatusSchema = z.object({
  id: inquiryIdSchema,
  status: inquiryStatusSchema,
});

// ---------------------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------------------

// Turns a failed safeParse() into a plain, serialisable result for the UI:
//   { ok: false, error: "…", formErrors: ["…"], fieldErrors: { status: ["Choose a valid status."] } }
// formErrors holds problems with the input as a whole (e.g. no object was sent at all);
// fieldErrors holds problems with individual fields.
export function validationFailure(error, message = "Please check the highlighted fields.") {
  const { formErrors, fieldErrors } = z.flattenError(error);
  return { ok: false, error: message, formErrors, fieldErrors };
}
