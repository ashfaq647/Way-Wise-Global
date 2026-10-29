// Shared admin styles, taken from the public site: Oxanium bold buttons in brand red
// #b80100 (hover #9a0100), white outline buttons, #2e2e2e borders on near-black
// surfaces. In px, not rem: see app/admin/(panel)/layout.js.

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#b80100] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const buttonBase = `inline-flex h-[44px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] px-[20px] font-oxanium text-[14px] font-bold leading-[20px] text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

// Red filled, like "Partner with us" on the site
export const buttonPrimary = `${buttonBase} bg-[#b80100] hover:bg-[#9a0100]`;

// Outlined, like the CTA banner button on the site
export const buttonSecondary = `${buttonBase} ring-1 ring-inset ring-[#3a3a3a] hover:bg-white/5 hover:ring-white`;

// Text inputs and selects
export const fieldClass =
  "h-[44px] w-full rounded-[8px] border border-[#3a3a3a] bg-[#0c0c0c] text-[14px] text-white outline-none transition-colors duration-200 placeholder:text-[#7a7a7a] hover:border-[#4a4a4a] focus:border-white focus-visible:ring-2 focus-visible:ring-[#b80100]/40 aria-[invalid=true]:border-[#e00000]";

// Cards and panels
export const panelClass = "rounded-[12px] border border-[#2e2e2e] bg-[#0c0c0c]";

// Small uppercase label above headings, with the red rule the site uses for accents
export const eyebrowClass =
  "flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e00000] before:h-[2px] before:w-[16px] before:bg-[#b80100] before:content-['']";
