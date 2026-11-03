import { z } from "zod";
import { EMAIL_MESSAGE_MAX, EMAIL_SUBJECT_MAX } from "@/lib/email/limits";
import { inquiryIdSchema } from "@/lib/validations/inquiry";

// Server-side validation for an email written to an inquiry from the admin panel.
// There is deliberately no "to" field: the recipient is always the inquiry's own email
// address, looked up in the database by inquiryId.

// Any control character, including newlines: a subject is one line, which also rules out
// email header injection.
const CONTROL_CHARS = /\p{Cc}/u;
// The message may contain newlines and tabs, but no other control characters.
const CONTROL_CHARS_EXCEPT_NEWLINES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
// At least one letter or digit, so a message made only of spaces fails.
const HAS_VISIBLE_TEXT = /[\p{L}\p{N}]/u;

export const inquiryEmailSchema = z.object({
  inquiryId: inquiryIdSchema,
  subject: z
    .string({ error: "Enter a subject." })
    .trim()
    .min(1, { error: "Enter a subject." })
    .max(EMAIL_SUBJECT_MAX, { error: `Subject must be ${EMAIL_SUBJECT_MAX} characters or fewer.` })
    .refine((value) => !CONTROL_CHARS.test(value), { error: "The subject must be a single line of plain text." })
    .refine((value) => HAS_VISIBLE_TEXT.test(value), { error: "Enter a subject." }),
  message: z
    .string({ error: "Write a message." })
    .trim()
    .max(EMAIL_MESSAGE_MAX, { error: `Message must be ${EMAIL_MESSAGE_MAX} characters or fewer.` })
    .refine((value) => !CONTROL_CHARS_EXCEPT_NEWLINES.test(value), { error: "The message contains invalid characters." })
    .refine((value) => HAS_VISIBLE_TEXT.test(value), { error: "Write a message." }),
});
