import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { eyebrowClass, focusRing } from "@/components/admin/ui";

export const metadata = { title: "Log in" };

// One background for the whole page (admin-login-bg.webp: wireframe skyline and globe on
// the left, dark space on the right). From 1024px the brand text sits over the artwork and
// the form over the dark side. Below that: just the form, over a dimmed background.
export default function AdminLoginPage() {
  return (
    <main className="relative isolate grid min-h-dvh overflow-hidden bg-[#050505] lg:grid-cols-[minmax(0,1fr)_minmax(480px,560px)]">
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
        <Image src="/images/logo.svg" alt="" width={290} height={64} className="h-auto w-[200px]" />

        <div className="max-w-[520px]">
          <p className={eyebrowClass}>Internal tools</p>
          <p className="mt-[16px] font-oxanium text-[40px] font-bold leading-[48px] text-white">
            Way Wise Global
            <br />
            <span className="text-[#e00000]">Admin Panel</span>
          </p>
          <p className="mt-[16px] text-[16px] leading-[26px] text-[#e9e7e2]">
            Review and follow up on partnership inquiries submitted through the Way Wise Global website.
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center px-[16px] py-[40px] sm:px-[32px]">
        <div className="w-full max-w-[420px]">
          <div className="mb-[32px] flex flex-col items-center text-center lg:hidden">
            <Image src="/images/logo.svg" alt="Way Wise Global" width={290} height={64} className="h-auto w-[180px]" priority />
            <p className={`${eyebrowClass} mt-[14px]`}>Admin Panel</p>
          </div>

          <div className="rounded-[16px] border border-[#2e2e2e] bg-[#0a0a0a]/90 p-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-[6px] sm:p-[36px]">
            <div className="mb-[28px]">
              <h1 className="font-oxanium text-[28px] font-bold leading-[36px] text-white">Sign in</h1>
              <p className="mt-[6px] text-[14px] leading-[22px] text-[#9d9d9d]">Access the Way Wise Global admin panel.</p>
            </div>
            <LoginForm />
          </div>

          <div className="mt-[24px] flex flex-col items-center gap-[14px] text-center">
            <p className="flex items-center gap-[6px] text-[12px] text-[#6b6b6b]">
              <ShieldCheck className="size-[14px]" aria-hidden />
              Restricted area for Way Wise Global staff
            </p>
            <Link
              href="/"
              className={`inline-flex items-center gap-[6px] rounded-[6px] text-[13px] text-[#9d9d9d] transition-colors duration-200 hover:text-white ${focusRing}`}
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
