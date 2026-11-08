import localFont from "next/font/local";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { focusRing } from "@/components/admin/ui";

// Same semi-bold Oxanium file as the Partner With Us form
const oxaniumSemiBold = localFont({ src: "../../app/fonts/oxanium-semibold-latin.woff2", weight: "600" });

// Same look as the "Send partnership inquiry" button in the Partner With Us form.
// States: hover (darker red), disabled (muted, no pointer), loading (aria-busy="true":
// spinner instead of the arrow). Used by the log in, forgot and reset password forms.
export default function AuthSubmitButton({ pending, children }) {
  return (
    <button
      type="submit"
      aria-busy={pending ? "true" : undefined}
      className={`${oxaniumSemiBold.className} group mt-[4px] flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-[#b80100] px-[16px] py-[14px] text-[15px] font-semibold leading-[24px] text-white transition-colors duration-300 hover:bg-[#9a0100] disabled:cursor-not-allowed disabled:bg-[#4a1212] disabled:text-white/60 aria-busy:cursor-wait aria-busy:bg-[#9a0100] ${focusRing}`}
    >
      {children}
      <LoaderCircle aria-hidden className="hidden size-[20px] animate-spin group-aria-busy:block motion-reduce:animate-none" />
      <span aria-hidden className="relative size-[24px] shrink-0 overflow-hidden group-disabled:opacity-60 group-aria-busy:hidden">
        <span className="absolute right-0 top-0 flex transition-transform duration-300 ease-out group-hover:translate-x-1/2 group-disabled:translate-x-0">
          <ArrowRight className="size-[24px]" />
          <ArrowRight className="size-[24px]" />
        </span>
      </span>
    </button>
  );
}
