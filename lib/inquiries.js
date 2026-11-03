import "server-only";
import { prisma } from "@/lib/db";
import { createInquiryWithReference } from "@/lib/inquiry-reference";
import { inquirySchema } from "@/lib/validations/inquiry";

// Public data layer for inquiries: used by the Partner With Us form, so no sign-in is
// required. It can only ADD an inquiry and returns nothing about it, so the public side
// can never read inquiry data. (Admin reads and updates live in lib/admin/inquiries.js.)

// Returns { ok: true } | { ok: false, reason: "invalid", error }
export async function createInquiry(input) {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid", error: parsed.error };

  // gets its WWG-YYYY-0001 reference in the same transaction (lib/inquiry-reference.js)
  await createInquiryWithReference(prisma, { ...parsed.data, status: "NEW" }, { select: { id: true } });
  return { ok: true };
}
