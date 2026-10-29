import Notice from "@/components/admin/Notice";
import { eyebrowClass } from "@/components/admin/ui";

// Page heading used at the top of every admin page. `eyebrow` is the small red label above
// the title (like the section labels on the public site). `actions` sits on the right on
// wide screens and below the text on narrow ones.
export default function AdminHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex flex-col gap-[16px] sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className={`${eyebrowClass} mb-[10px]`}>{eyebrow}</p>}
        <h1 className="break-words font-oxanium text-[26px] font-bold leading-[34px] text-white sm:text-[32px] sm:leading-[40px]">
          {title}
        </h1>
        {description && (
          <p className="mt-[6px] max-w-[680px] text-[14px] leading-[22px] text-[#b2b2b2]">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-[12px]">{actions}</div>}
    </header>
  );
}

// Shown on every page while the panel runs on sample data, so nothing on screen is
// mistaken for real inquiries.
export function SampleDataNotice() {
  return (
    <Notice variant="warning" title="Preview with sample data.">
      These inquiries are placeholders and changes are not saved. Real submissions will appear here once the
      database is connected.
    </Notice>
  );
}
