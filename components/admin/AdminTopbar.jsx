"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { focusRing } from "@/components/admin/ui";

// Breadcrumb trail for the current admin route
function crumbsFor(pathname) {
  const crumbs = [{ label: "Admin", href: "/admin" }];
  if (pathname === "/admin") crumbs.push({ label: "Dashboard" });
  else if (pathname.startsWith("/admin/inquiries")) {
    const isDetail = pathname !== "/admin/inquiries";
    crumbs.push({ label: "Inquiries", href: isDetail ? "/admin/inquiries" : undefined });
    if (isDetail) crumbs.push({ label: "Inquiry details" });
  }
  return crumbs;
}

// Desktop top bar (from 1024px). Below that the mobile bar in AdminSidebar takes over.
export default function AdminTopbar() {
  const crumbs = crumbsFor(usePathname());

  return (
    <div className="sticky top-0 z-20 hidden h-[64px] items-center justify-between gap-[16px] border-b border-[#2e2e2e] bg-black/80 px-[40px] backdrop-blur-[10px] lg:flex">
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-[6px] text-[13px] leading-[20px]">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex min-w-0 items-center gap-[6px]">
              {i > 0 && <ChevronRight className="size-[14px] shrink-0 text-[#4a4a4a]" aria-hidden />}
              {c.href ? (
                <Link href={c.href} className={`rounded-[4px] text-[#9d9d9d] transition-colors duration-200 hover:text-white ${focusRing}`}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate font-medium text-white">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-[12px]">
        <span className="inline-flex items-center gap-[6px] rounded-full border border-[rgba(255,165,0,0.3)] bg-[rgba(255,165,0,0.06)] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#ffcf80]">
          <span aria-hidden className="size-[6px] rounded-full bg-[#FFA500]" />
          Sample data
        </span>
        <Link
          href="/"
          className={`inline-flex h-[36px] items-center gap-[6px] rounded-[8px] px-[12px] text-[13px] font-medium text-[#b2b2b2] ring-1 ring-inset ring-[#2e2e2e] transition-colors duration-200 hover:text-white hover:ring-[#4a4a4a] ${focusRing}`}
        >
          View website
          <ExternalLink className="size-[14px]" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
