import { CircleAlert, Info, TriangleAlert } from "lucide-react";

// Inline message box used across the admin panel. Text stays in neutral ink; the icon
// and border carry the tone, so the meaning never rests on colour alone.
const variants = {
  info: { box: "border-[#3a3a3a] bg-[#101010]", icon: Info, iconClass: "text-[#b2b2b2]" },
  warning: { box: "border-[rgba(255,165,0,0.3)] bg-[rgba(255,165,0,0.06)]", icon: TriangleAlert, iconClass: "text-[#FFA500]" },
  error: { box: "border-[rgba(224,0,0,0.45)] bg-[rgba(224,0,0,0.08)]", icon: CircleAlert, iconClass: "text-[#ff4d4d]" },
};

export default function Notice({ variant = "info", title, children, className = "" }) {
  const v = variants[variant] ?? variants.info;
  const Icon = v.icon;
  return (
    <div className={`flex gap-[12px] rounded-[10px] border px-[16px] py-[12px] text-[13px] leading-[20px] text-[#e9e7e2] ${v.box} ${className}`}>
      <Icon className={`mt-[2px] size-[16px] shrink-0 ${v.iconClass}`} aria-hidden />
      <p className="min-w-0">
        {title && <span className="font-semibold text-white">{title} </span>}
        {children}
      </p>
    </div>
  );
}
