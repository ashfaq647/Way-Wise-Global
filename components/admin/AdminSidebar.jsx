"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Inbox, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { eyebrowClass, focusRing } from "@/components/admin/ui";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
];

function isActive(pathname, item) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2e2e2e] pb-[20px]">
        <Link href="/admin" onClick={onNavigate} className={`block w-fit rounded-[8px] ${focusRing}`}>
          <Image src="/images/logo.svg" alt="Way Wise Global" width={290} height={64} className="h-auto w-[156px]" priority />
        </Link>
        <p className={`${eyebrowClass} mt-[14px]`}>Admin Panel</p>
      </div>

      <nav aria-label="Admin" className="mt-[24px]">
        <p className="mb-[10px] px-[14px] text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b6b6b]">Menu</p>
        <ul className="flex flex-col gap-[4px]">
          {nav.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex h-[44px] items-center gap-[12px] rounded-[8px] px-[14px] text-[14px] transition-colors duration-200 ${focusRing} ${
                    active
                      ? "bg-[linear-gradient(90deg,rgba(184,1,0,0.22),rgba(184,1,0,0.04))] font-medium text-white"
                      : "text-[#b2b2b2] hover:bg-[#151515] hover:text-white"
                  }`}
                >
                  {active && <span aria-hidden className="absolute inset-y-[10px] left-0 w-[3px] rounded-r bg-[#e00000]" />}
                  <item.icon
                    className={`size-[18px] transition-colors duration-200 ${active ? "text-[#e00000]" : "text-[#7a7a7a] group-hover:text-white"}`}
                    aria-hidden
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-[12px]">
        {/* Sign-in isn't implemented yet, so this button is shown but disabled rather than
            pretending to end a session. */}
        <div className="rounded-[10px] border border-[#2e2e2e] bg-[#0c0c0c]/80 p-[6px]">
          <button
            type="button"
            disabled
            aria-describedby="admin-logout-note"
            className="flex h-[40px] w-full cursor-not-allowed items-center gap-[12px] rounded-[6px] px-[10px] text-[14px] text-[#6b6b6b]"
          >
            <LogOut className="size-[18px]" aria-hidden />
            Log out
          </button>
          <p id="admin-logout-note" className="px-[10px] pb-[6px] text-[12px] leading-[18px] text-[#6b6b6b]">
            Available once sign-in is set up.
          </p>
        </div>
        <Link
          href="/"
          onClick={onNavigate}
          className={`inline-flex items-center gap-[6px] rounded-[6px] px-[14px] py-[6px] text-[13px] text-[#9d9d9d] transition-colors duration-200 hover:text-white ${focusRing}`}
        >
          <ArrowLeft className="size-[14px]" aria-hidden />
          Back to website
        </Link>
      </div>
    </div>
  );
}

// Fixed sidebar from 1024px. Below that: a top bar with a menu button that opens the
// same navigation as a drawer.
export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // While the drawer is open: lock page scroll and close on Escape
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* faint dotted wave from the public site at the bottom of the sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-[#2e2e2e] bg-[#0a0a0a] bg-[url('/images/vision-bg.png')] bg-[length:960px_auto] bg-[position:35%_100%] bg-no-repeat bg-blend-lighten px-[20px] py-[24px] lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      <div className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#2e2e2e] bg-[#0a0a0a]/95 px-[16px] backdrop-blur-[8px] sm:px-[24px] lg:hidden">
        <Link href="/admin" className={`flex items-center gap-[10px] rounded-[8px] ${focusRing}`}>
          <Image src="/images/logo.svg" alt="Way Wise Global" width={290} height={64} className="h-auto w-[120px]" priority />
          <span className="border-l border-[#3a3a3a] pl-[10px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e00000]">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="-mr-[8px] flex size-[44px] cursor-pointer items-center justify-center rounded-[8px] text-white outline-none transition-colors duration-200 hover:text-[#e00000] focus-visible:ring-2 focus-visible:ring-[#b80100]"
        >
          <Menu className="size-[22px]" aria-hidden />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div aria-hidden onClick={close} className="absolute inset-0 bg-black/70 backdrop-blur-[4px]" />
          <div
            id="admin-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-[#2e2e2e] bg-[#0a0a0a] px-[20px] py-[24px]"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close navigation"
              autoFocus
              className="absolute right-[12px] top-[16px] flex size-[40px] cursor-pointer items-center justify-center rounded-[8px] text-[#b2b2b2] outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[#b80100]"
            >
              <X className="size-[20px]" aria-hidden />
            </button>
            <SidebarContent pathname={pathname} onNavigate={close} />
          </div>
        </div>
      )}
    </>
  );
}
