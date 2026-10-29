export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="relative isolate flex flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#3a3a3a] bg-[#0a0a0a] px-[20px] py-[56px] text-center">
      {/* faint dotted wave from the public site */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url('/images/vision-bg.png')] bg-[length:1200px_auto] bg-bottom bg-no-repeat opacity-70 mix-blend-lighten"
      />
      {Icon && (
        <span className="mb-[16px] flex size-[52px] items-center justify-center rounded-full border border-[#2e2e2e] bg-[#151515] text-[#e00000]">
          <Icon className="size-[22px]" aria-hidden />
        </span>
      )}
      <p className="font-oxanium text-[18px] font-bold leading-[24px] text-white">{title}</p>
      {description && (
        <p className="mt-[6px] max-w-[420px] text-[14px] leading-[22px] text-[#9d9d9d]">{description}</p>
      )}
      {children && <div className="mt-[20px] flex flex-wrap justify-center gap-[12px]">{children}</div>}
    </div>
  );
}
