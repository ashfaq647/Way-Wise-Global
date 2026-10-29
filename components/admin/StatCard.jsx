// A single headline number. `hint` is an optional line of context under it.
export default function StatCard({ label, value, icon: Icon, hint, accent = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border bg-[linear-gradient(180deg,#121212_0%,#0a0a0a_100%)] p-[20px] transition-colors duration-300 hover:border-[#3a3a3a] ${
        accent ? "border-[rgba(184,1,0,0.45)]" : "border-[#2e2e2e]"
      }`}
    >
      {/* thin brand-red rule, like the section accents on the public site */}
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[2px] ${accent ? "bg-[#b80100]" : "bg-[#2e2e2e]"}`}
      />
      {accent && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-[40px] -top-[60px] size-[160px] rounded-full bg-[radial-gradient(circle,rgba(184,1,0,0.25),transparent_70%)]"
        />
      )}
      <div className="relative flex items-start justify-between gap-[12px]">
        <p className="text-[13px] font-medium leading-[20px] text-[#b2b2b2]">{label}</p>
        {Icon && (
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(224,0,0,0.25)] bg-[rgba(224,0,0,0.1)] text-[#e00000]">
            <Icon className="size-[18px]" aria-hidden />
          </span>
        )}
      </div>
      <p className="relative mt-[10px] font-oxanium text-[36px] font-bold leading-[44px] text-white">{value}</p>
      {hint && <p className="relative mt-[2px] text-[12px] leading-[18px] text-[#7a7a7a]">{hint}</p>}
    </div>
  );
}
