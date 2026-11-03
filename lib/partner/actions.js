"use server";

import { createInquiry } from "@/lib/inquiries";
import { HONEYPOT_FIELD } from "@/lib/inquiry-options";
import { inquirySchema, validationFailure } from "@/lib/validations/inquiry";

// Server Action for the public Partner With Us form. Anyone can call it, so it takes only
// the known form fields, validates them on the server (lib/inquiries.js) and returns just
// success or error messages, never inquiry data or database details.

const FORM_FIELDS = Object.keys(inquirySchema.shape);
const SAVE_FAILED = { ok: false, error: "Sorry, your inquiry could not be sent. Please try again in a moment." };

// Result shapes:
//   { ok: true }                                       sent
//   { ok: false, error, formErrors?, fieldErrors? }    invalid input or a server problem
export async function submitPartnerInquiry(formData) {
  if (!(formData instanceof FormData)) return SAVE_FAILED;

  // Spam trap: the hidden field is filled in, so this is a bot. Pretend it worked and
  // save nothing, so the bot gets no hint.
  if (formData.get(HONEYPOT_FIELD)) {
    console.warn("[partner] spam trap triggered; submission discarded"); // no visitor data logged
    return { ok: true };
  }

  // Only the fields the form has; anything else (status, id, …) is ignored
  const input = Object.fromEntries(FORM_FIELDS.map((name) => [name, formData.get(name) ?? undefined]));

  try {
    const result = await createInquiry(input);
    if (!result.ok) return validationFailure(result.error, "Please check the highlighted fields.");
    return { ok: true };
  } catch (error) {
    console.error("[partner] submitPartnerInquiry failed:", error);
    return SAVE_FAILED;
  }
}
