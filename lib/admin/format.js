// Fixed locale and time zone so the server and the browser render the same text
// (no hydration mismatch).
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatDate(value) {
  return dateFormat.format(new Date(value));
}

export function formatDateTime(value) {
  return `${dateTimeFormat.format(new Date(value))} UTC`;
}
