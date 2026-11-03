// Shared by the public Partner With Us form (components/PartnerWithUsModal.jsx) and its
// server-side validation (lib/validations/inquiry.js). Kept in its own small file so the
// public page doesn't load the validation library just for this list.

// "How can we work together?" options.
// TODO: the Figma file has no options for this dropdown. These come from the site's own
// copy (CtaBanner) - replace them with the real list.
export const INQUIRY_OPPORTUNITIES = [
  "Business Partnership",
  "Specialized Services",
  "International Collaboration",
  "Other",
];

// Name of the hidden spam-trap field. People never see or fill it; bots usually do.
// Deliberately meaningless: names like "address" get filled by browser autofill.
export const HONEYPOT_FIELD = "_gotcha";
