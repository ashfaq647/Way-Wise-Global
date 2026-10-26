"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

// Figma uses Oxanium SemiBold for the title and Close button. The site only loads 400 and
// 700, and every next/font/google Oxanium shares one family name, so loading 600 there
// would also change other headings that use font-semibold. A separate family avoids that.
const oxaniumSemiBold = localFont({
  src: "../app/fonts/oxanium-semibold-latin.woff2",
  weight: "600",
  declarations: [{ prop: "font-family", value: "oxaniumSemiBold" }],
});

// TODO: the Figma file has no options for this dropdown. These come from the site's own
// copy (CtaBanner) - replace them with the real list.
const opportunities = [
  "Business Partnership",
  "Specialized Services",
  "International Collaboration",
  "Other",
];

// Fields in Figma order: two per row from 640px, one per row below that.
const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Your Name", autoComplete: "name", required: true },
  { name: "jobTitle", label: "Job Title/Role", placeholder: "e.g. Managing Director", autoComplete: "organization-title", required: true },
  { name: "company", label: "Company / Organization", placeholder: "Your Company", autoComplete: "organization", required: true },
  { name: "email", label: "Business Email", type: "email", placeholder: "you@company.com", autoComplete: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Your Phone Number", autoComplete: "tel", required: true },
  { name: "website", label: "Company Website", type: "url", placeholder: "https://", autoComplete: "url" },
  { name: "opportunity", label: "How can we work together?", select: true, placeholder: "Select an opportunity", required: true },
  { name: "business", label: "Business are you interested in?", placeholder: "e.g. Way Wise Tech", required: true },
];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Sizes are in px, not rem: from 1280px the root font size shrinks with the viewport
// (see globals.css), and the form should stay at its Figma size.
const inputClass =
  "h-[47px] w-full rounded-[8px] border-[0.5px] border-[#e9e7e2] bg-transparent px-[16px] font-poppins text-[14px] text-white outline-none transition-colors duration-200 placeholder:text-[#b2b2b2] focus:border focus:border-white";

function Label({ children, required }) {
  return (
    <span className="font-poppins text-[16px] leading-normal text-white">
      {children}
      {required && <span className="text-[#e00000]">*</span>}
    </span>
  );
}

export default function PartnerWithUsModal({ open, onClose, returnFocusRef }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();

  // While open: lock page scroll, close on Escape, keep Tab inside the form, and give
  // focus back to the button that opened it on close
  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef.current;
    const previous = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    // keep the page from jumping sideways when the scrollbar disappears
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = previousPadding;
      document.removeEventListener("keydown", onKey);
      returnTo?.focus({ preventScroll: true });
    };
  }, [open, onClose, returnFocusRef]);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send `new FormData(e.currentTarget)` to the backend once there is one
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop (Figma 1:2265): click it to close */}
          <motion.div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-[8px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(rgba(217,217,217,0.1), rgba(217,217,217,0.1))",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />

          {/* pointer-events-none lets clicks around the form reach the backdrop */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-[16px] sm:p-[24px]">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              tabIndex={-1}
              className="pointer-events-auto flex max-h-full w-full max-w-[680px] flex-col overflow-y-auto overscroll-contain rounded-[12px] bg-[#0a0a0a] px-[20px] pb-[24px] pt-[12px] shadow-[0_4px_20px_rgba(255,255,255,0.2)] outline-none sm:px-[40px] sm:pb-[40px] sm:pt-[24px]"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col border-b-[0.5px] border-[#e9e9e9] py-[16px]">
                <h2
                  id={titleId}
                  className={`${oxaniumSemiBold.className} text-[26px] font-semibold leading-[36px] text-white sm:text-[32px] sm:leading-[45px]`}
                >
                  Partner With Way Wise
                </h2>
                <p id={descriptionId} className="font-poppins text-[16px] leading-normal text-[#9c9c9c]">
                  Let&apos;s build something valuable together.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[16px] pt-[24px] sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className="flex min-w-0 flex-col gap-[8px]">
                    <Label required={field.required}>{field.label}</Label>
                    {field.select ? (
                      <span className="relative">
                        <select
                          name={field.name}
                          required={field.required}
                          defaultValue=""
                          className={`${inputClass} cursor-pointer appearance-none pr-[40px] invalid:text-[#b2b2b2]`}
                        >
                          <option value="" disabled hidden>
                            {field.placeholder}
                          </option>
                          {opportunities.map((option) => (
                            <option key={option} value={option} className="bg-[#0a0a0a] text-white">
                              {option}
                            </option>
                          ))}
                        </select>
                        <Image
                          src="/images/icons/chevron-down.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2"
                        />
                      </span>
                    ) : (
                      <input
                        type={field.type ?? "text"}
                        name={field.name}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        required={field.required}
                        className={inputClass}
                      />
                    )}
                  </label>
                ))}

                {/* In Figma this label sits 16px above the box, not 8px like the others */}
                <label className="flex flex-col gap-[16px] sm:col-span-2">
                  <Label>Tell us about your opportunity</Label>
                  <textarea
                    name="message"
                    className="h-[89px] w-full resize-none rounded-[8px] border border-[#e9e7e2] bg-transparent px-[16px] py-[12px] font-poppins text-[14px] text-white outline-none transition-colors duration-200 focus:border-white"
                  />
                </label>

                <div className="flex flex-col-reverse gap-[16px] sm:col-span-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`${oxaniumSemiBold.className} h-[56px] w-full shrink-0 cursor-pointer rounded-[4px] border border-white bg-white text-[16px] font-semibold leading-[20px] text-[#b80100] sm:w-[165px]`}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="group flex min-h-[56px] flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-[#b80100] px-[16px] py-[16px] text-center font-oxanium text-[16px] font-bold leading-[24px] text-white transition-colors duration-300 hover:bg-[#9a0100] sm:px-[30px]"
                  >
                    SEND PARTNERSHIP INQUIRY
                    {/* Figma "Arrow/Dynamic": a second arrow slides in on hover */}
                    <span aria-hidden className="relative size-[24px] shrink-0 overflow-hidden">
                      <span className="absolute right-0 top-0 flex transition-transform duration-300 ease-out group-hover:translate-x-1/2">
                        <ArrowRight className="size-[24px]" />
                        <ArrowRight className="size-[24px]" />
                      </span>
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
