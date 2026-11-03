import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { eyebrowClass, focusRing } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/auth/session";

export const metadata = { title: "Log in" };

// The red label above the hero heading, a little larger and lighter than the shared
// eyebrow so it reads on the artwork
const heroEyebrowClass =
  "flex items-center gap-[8px] text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ff4d4d] before:h-[2px] before:w-[16px] before:bg-[#e00000] before:content-['']";
// brightens the logo's small red "GLOBAL" so it reads on the dark background
const logoClass = "h-auto [filter:brightness(1.3)]";

// One background for the whole page (admin-login-bg.webp: wireframe skyline and globe on
// the left, dark space on the right). From 1024px the brand text sits over the artwork and
// the form over the dark side. Below that: just the form, over a dimmed background.
export default async function AdminLoginPage() {
  // Already signed in (checked against the database): go straight to the panel
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="relative isolate grid min-h-dvh overflow-hidden bg-[#050505] lg:grid-cols-2">
      <Image
        src="/images/admin-login-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-left"
      />
      {/* below 1024px the form sits on the artwork, so dim it for readability */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/65 lg:hidden" />

      <section aria-hidden className="hidden lg:flex lg:flex-col lg:justify-between lg:p-[48px]">
        <Image src="/images/logo.svg" alt="" width={290} height={64} className={`${logoClass} w-[200px]`} />

        <div className="max-w-[520px]">
          <p className={heroEyebrowClass}>Internal tools</p>
          <p className="mt-[16px] font-oxanium text-[40px] font-bold leading-[48px] text-white">
            Way Wise Global
            <br />
            <span className="text-[#e00000]">Admin Panel</span>
          </p>
          <p className="mt-[16px] text-balance text-[16px] leading-[26px] text-[#e9e7e2]">
            Review and follow up on partnership inquiries submitted through the Way Wise Global website.
          </p>
        </div>
      </section>

      {/* From 1024px: right half of the page, same 48px side padding as the brand panel,
          card centred in it. Below: card on its own, full width up to 420px. */}
      <div className="flex flex-col items-center justify-center px-[20px] py-[40px] sm:px-[32px] lg:p-[48px]">
        <div className="w-full max-w-[420px]">
          <div className="mb-[32px] flex flex-col items-center text-center lg:hidden">
            <Image src="/images/logo.svg" alt="Way Wise Global" width={290} height={64} className={`${logoClass} w-[180px]`} priority />
            <p className={`${eyebrowClass} mt-[14px]`}>Admin Panel</p>
          </div>

          <div className="rounded-[16px] border border-[rgba(255,255,255,0.1)] bg-[#121316]/95 p-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-[6px] sm:p-[36px]">
            <div className="mb-[28px]">
              <h1 className="font-oxanium text-[28px] font-bold leading-[36px] text-white">Sign in</h1>
              <p className="mt-[6px] text-[14px] leading-[22px] text-[#b0b6c0]">Access the Way Wise Global admin panel.</p>
            </div>
            <LoginForm />
          </div>

          <div className="mt-[20px] flex flex-col items-center gap-[4px] text-center">
            <p className="flex items-center gap-[6px] text-[12px] leading-[18px] text-[#9aa1ab]">
              <ShieldCheck className="size-[14px]" aria-hidden />
              Restricted area for Way Wise Global staff
            </p>
            {/* 44px tall tap target */}
            <Link
              href="/"
              className={`inline-flex min-h-[44px] items-center gap-[6px] rounded-[8px] px-[14px] text-[14px] text-[#b0b6c0] transition-colors duration-200 hover:text-white ${focusRing}`}
            >
              <ArrowLeft className="size-[14px]" aria-hidden />
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
