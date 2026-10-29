// Inquiry statuses. The keys are what will be stored in the database later; the order
// here is the order they appear in filters and selectors.
export const INQUIRY_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED", label: "Closed" },
];

export function statusLabel(value) {
  return INQUIRY_STATUSES.find((s) => s.value === value)?.label ?? value;
}
