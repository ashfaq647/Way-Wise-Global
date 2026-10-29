"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { buttonPrimary, buttonSecondary } from "@/components/admin/ui";

// Shown inside the admin shell when a page fails to render. `retry` re-fetches and
// re-renders the segment (Next.js 16.3+).
export default function AdminError({ retry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-[rgba(224,0,0,0.35)] bg-[rgba(224,0,0,0.04)] px-[20px] py-[56px] text-center">
      <span className="mb-[16px] flex size-[52px] items-center justify-center rounded-full border border-[rgba(224,0,0,0.35)] bg-[rgba(224,0,0,0.1)] text-[#ff4d4d]">
        <TriangleAlert className="size-[22px]" aria-hidden />
      </span>
      <h1 className="font-oxanium text-[20px] font-bold leading-[28px] text-white">Something went wrong</h1>
      <p className="mt-[6px] max-w-[420px] text-[14px] leading-[22px] text-[#9d9d9d]">
        This page could not be loaded. Try again, or go back to the dashboard.
      </p>
      <div className="mt-[20px] flex flex-wrap justify-center gap-[12px]">
        <button type="button" onClick={() => retry()} className={buttonPrimary}>
          <RotateCcw className="size-[16px]" aria-hidden />
          Try again
        </button>
        <Link href="/admin" className={buttonSecondary}>
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
