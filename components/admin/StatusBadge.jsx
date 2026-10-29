import { statusLabel } from "@/lib/admin/statuses";

// Colours come from the site palette: brand red for new, the amber used in About Us for
// in review, and the light/grey neutrals for contacted and closed.
// Exported so the dashboard's status breakdown uses the same colour per status.
export const styles = {
  NEW: { badge: "border-[rgba(224,0,0,0.4)] bg-[rgba(224,0,0,0.15)] text-[#ff4d4d]", dot: "bg-[#e00000]" },
  IN_REVIEW: { badge: "border-[rgba(255,165,0,0.35)] bg-[rgba(255,165,0,0.1)] text-[#ffb733]", dot: "bg-[#FFA500]" },
  CONTACTED: { badge: "border-[rgba(238,238,238,0.25)] bg-[rgba(238,238,238,0.1)] text-[#f2f2f2]", dot: "bg-[#f2f2f2]" },
  CLOSED: { badge: "border-[#2e2e2e] bg-[#151515] text-[#9d9d9d]", dot: "bg-[#6b6b6b]" },
};

export default function StatusBadge({ status }) {
  const style = styles[status] ?? styles.CLOSED;
  return (
    <span
      className={`inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border px-[10px] py-[3px] text-[12px] font-medium leading-[18px] ${style.badge}`}
    >
      <span aria-hidden className={`size-[6px] rounded-full ${style.dot}`} />
      {statusLabel(status)}
    </span>
  );
}
