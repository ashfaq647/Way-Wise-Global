import { styles as statusStyles } from "@/components/admin/StatusBadge";
import { INQUIRY_STATUSES } from "@/lib/admin/statuses";
import { panelClass } from "@/components/admin/ui";

// One stacked bar: share of inquiries per status, in the same colours as the status
// badges. The legend below lists every status with its count and share, so the numbers
// never depend on reading the colours.
export default function StatusBreakdown({ counts, total }) {
  const rows = INQUIRY_STATUSES.map((s) => ({
    ...s,
    count: counts[s.value] ?? 0,
    share: total ? Math.round(((counts[s.value] ?? 0) / total) * 100) : 0,
    dot: (statusStyles[s.value] ?? statusStyles.CLOSED).dot,
  }));

  return (
    <section aria-labelledby="breakdown-heading" className={`${panelClass} p-[20px] sm:p-[24px]`}>
      <div className="flex flex-wrap items-baseline justify-between gap-[8px]">
        <h2 id="breakdown-heading" className="font-oxanium text-[18px] font-bold leading-[24px] text-white">
          Status Breakdown
        </h2>
        <p className="text-[13px] text-[#9d9d9d]">
          {total} {total === 1 ? "inquiry" : "inquiries"} in total
        </p>
      </div>

      {total > 0 && (
        // 2px gaps between segments; each segment shows its numbers on hover. The outer
        // segments align their label to the bar's edge so it never sticks out of the page.
        <div aria-hidden className="mt-[16px] flex h-[12px] gap-[2px]">
          {rows
            .filter((r) => r.count > 0)
            .map((r, i, shown) => (
              <div
                key={r.value}
                className={`group relative h-full rounded-[3px] first:rounded-l-[6px] last:rounded-r-[6px] ${r.dot}`}
                style={{ flexGrow: r.count, flexBasis: 0 }}
              >
                <span className={`pointer-events-none absolute bottom-[calc(100%+8px)] z-10 ${
                  i === 0 ? "left-0" : i === shown.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
                } whitespace-nowrap rounded-[6px] border border-[#3a3a3a] bg-[#151515] px-[8px] py-[4px] text-[12px] text-white opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-opacity duration-150 group-hover:opacity-100`}>
                  {r.label}: {r.count} ({r.share}%)
                </span>
              </div>
            ))}
        </div>
      )}

      <ul className="mt-[18px] grid grid-cols-2 gap-x-[16px] gap-y-[12px] md:grid-cols-4">
        {rows.map((r) => (
          <li key={r.value} className="flex min-w-0 items-start gap-[10px]">
            <span aria-hidden className={`mt-[6px] size-[8px] shrink-0 rounded-full ${r.dot}`} />
            <div className="min-w-0">
              <p className="truncate text-[13px] leading-[20px] text-[#b2b2b2]">{r.label}</p>
              <p className="text-[15px] font-medium leading-[22px] text-white">
                {r.count} <span className="text-[13px] font-normal text-[#7a7a7a]">· {r.share}%</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
