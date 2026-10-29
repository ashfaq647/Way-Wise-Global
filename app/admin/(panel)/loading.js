// Skeleton shown inside the admin shell while a page loads. The sidebar and top bar stay
// in place; only the content area is replaced.
function Bar({ className }) {
  return <div className={`animate-pulse rounded-[6px] bg-[#1b1b1b] motion-reduce:animate-none ${className}`} />;
}

export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[10px]">
        <Bar className="h-[12px] w-[90px]" />
        <Bar className="h-[36px] w-[240px]" />
        <Bar className="h-[16px] w-full max-w-[420px]" />
      </div>
      <Bar className="h-[46px] w-full rounded-[10px]" />
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[12px] border border-[#2e2e2e] bg-[#0c0c0c] p-[20px]">
            <Bar className="h-[14px] w-[110px]" />
            <Bar className="mt-[16px] h-[36px] w-[64px]" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-[12px] border border-[#2e2e2e] bg-[#0c0c0c]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-[12px] border-b border-[#1b1b1b] px-[16px] py-[14px] last:border-b-0">
            <Bar className="size-[36px] rounded-full" />
            <Bar className="h-[14px] flex-1" />
            <Bar className="hidden h-[14px] w-[160px] sm:block" />
            <Bar className="h-[22px] w-[80px] rounded-full" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
