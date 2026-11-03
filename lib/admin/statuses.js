import { InquiryStatus } from "@/lib/generated/prisma/enums.ts";

// Inquiry statuses for the UI. The values come from the Prisma enum (the database's list);
// only the labels live here. The order is the enum's order, which is the order they appear
// in filters and selectors.
const LABELS = {
  NEW: "New",
  IN_REVIEW: "In Review",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
};

export const INQUIRY_STATUSES = Object.values(InquiryStatus).map((value) => {
  // A status added to the Prisma schema without a label fails loudly (at build time,
  // when the admin pages render) instead of showing a raw enum value.
  if (!LABELS[value]) throw new Error(`Missing label for inquiry status "${value}" in lib/admin/statuses.js`);
  return { value, label: LABELS[value] };
});

export function statusLabel(value) {
  return INQUIRY_STATUSES.find((s) => s.value === value)?.label ?? value;
}
