import Image from "next/image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { SlSocialInstagram } from "react-icons/sl";

const SITE = {
  about:
    "Way Wise Global brings together technology, construction, real estate, trading, recruitment, and consumer ventures under one shared vision for sustainable global growth.",
  phone: { label: "000-000-1234", href: "tel:0000001234" },
  email: { label: "support@filewyse.com", href: "mailto:support@filewyse.com" },
  copyright: "© 2026 Way Wise Global. All Rights Reserved.",
  legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com/",
    red: false,
    icon: FaFacebookF,
  },
  { label: "X (Twitter)", href: "https://x.com/", red: false, path: "M3 3l7.2 9.6L3.4 21h1.8l5.8-6.6 4.9 6.6H21l-7.5-10L19.9 3h-1.8l-5.3 6-4.5-6H3zm3.4 1.4h1.6l9.6 15.2h-1.6L6.4 4.4z" },
  { label: "Instagram", href: "https://instagram.com/", red: false, path: "M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8A3.6 3.6 0 007.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6A3.6 3.6 0 0016.4 4H7.6zm9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" },
];

const COLUMNS = [
  {
    title: "The Group",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Leadership", href: "/#leadership" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/#contact" },
      { label: "News & Article", href: "/news" },
    ],
  },
  {
    title: "Our Companies",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Business Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Technology", href: "/services/technology" },
      { label: "Construction", href: "/services/construction" },
      { label: "Real Estate", href: "/services/real-estate" },
      { label: "Trading", href: "/services/trading" },
      { label: "Recruitment", href: "/services/recruitment" },
      { label: "Consumer Businesses", href: "/services/consumer" },
    ],
  },
];

// Public Sans is loaded in app/layout.js
const publicSans = "font-[family-name:var(--font-public-sans)]";

function Icon({ d, className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-white`} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function ContactItem({ label, value, href, children }) {
  return (
    <a href={href} className="group flex w-fit items-center gap-3">
      <span className="flex size-12 items-center justify-center rounded-[1.875rem] bg-[rgba(224,0,0,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#e00000] group-active:scale-110 group-active:bg-[#e00000]">
        {children}
      </span>
      <span className={`flex flex-col gap-0.5 text-white ${publicSans}`}>
        <span className="text-[max(0.75rem,12px)] leading-[max(1.125rem,16px)]">{label}</span>
        <span className="text-[max(1rem,15px)] font-semibold leading-[max(1.5rem,22px)] transition-colors duration-300 group-hover:text-[#ff4d4d] group-active:text-[#ff4d4d]">
          {value}
        </span>
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[url('/images/vision-bg.png')] bg-cover bg-center text-white">
      <Image
        src="/images/footer-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-10"
      />

      {/* Tailwind v4 only applies hover: on hover-capable devices, so each hover effect has an
          active: twin for touch screens. */}
      <div className="mx-auto flex max-w-[120rem] flex-col gap-10 px-6 pb-10 pt-12 sm:gap-[3.125rem] lg:px-16 xl:px-[15.625rem] xl:pt-20">
        <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap sm:gap-6">
          <Link
            href="/"
            aria-label="Way Wise Global home"
            className="block transition-opacity duration-300 hover:opacity-80 active:opacity-80"
          >
            <Image
              src="/images/logo.svg"
              alt="Way Wise Global"
              width={290}
              height={64}
              className="h-auto w-[clamp(8.125rem,40vw,10.625rem)] sm:w-[12.5rem] md:w-[18.125rem]"
              priority={false}
            />
          </Link>

          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`flex size-10 items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-[#e00000] active:-translate-y-1 active:bg-[#e00000] md:size-[3.125rem] ${
                  s.red ? "bg-[rgba(224,0,0,0.15)]" : "bg-[rgba(238,238,238,0.1)]"
                }`}
              >
                {s.icon ? (
                  <s.icon className="h-5 w-5 text-white" aria-hidden="true" />
                ) : (
                  <Icon d={s.path} />
                )}
              </a>
            ))}
          </div>
        </div>

        <hr className="border-0 border-t border-white/20" />

        <div className="flex flex-col gap-12 xl:flex-row xl:justify-between">
          <div className="flex shrink-0 flex-col gap-10">
            <p className="max-w-[29.375rem] font-poppins text-[max(1rem,14px)] text-white">{SITE.about}</p>

            <div className="flex flex-col gap-10">
              <ContactItem label="Have a question?" value={SITE.phone.label} href={SITE.phone.href}>
                <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-[#ff3b3b] stroke-[1.5] group-hover:stroke-white group-active:stroke-white" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73-1.15-.49-2.3-1.15-3.44-1.98a28.75 28.75 0 01-3.28-2.8 28.4 28.4 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67.64-.63 1.34-.94 2.08-.94.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.4.55.67.1.27.16.54.16.83z" />
                </svg>
              </ContactItem>

              <ContactItem label="Contact us at" value={SITE.email.label} href={SITE.email.href}>
                <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-[#ff3b3b] stroke-[1.5] group-hover:stroke-white group-active:stroke-white" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5z" />
                  <path d="M17 9l-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9" />
                </svg>
              </ContactItem>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-10 xl:flex xl:flex-none xl:items-start xl:gap-[6.25rem]">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-6">
                <h3
                  className={`whitespace-normal text-[max(1.125rem,16px)] font-semibold leading-[max(1.75rem,24px)] sm:whitespace-nowrap ${publicSans}`}
                >
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2 sm:gap-5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-block whitespace-normal py-1.5 font-poppins text-[max(0.875rem,13px)] leading-[calc(1.25/0.875)] text-white transition-all duration-300  hover:text-[#b80100] active:text-[#ff4d4d] sm:whitespace-nowrap sm:py-0"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[1.875rem]">
          <hr className="border-0 border-t border-white/20" />
          <div className={`flex flex-col gap-3 text-[max(1rem,14px)] leading-[max(1.5rem,22px)] sm:flex-row sm:items-center sm:justify-between ${publicSans}`}>
            <p>{SITE.copyright}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 sm:flex-nowrap sm:gap-[1.625rem]">
              {SITE.legal.map((l) => (
                <Link key={l.label} href={l.href} className="transition-colors duration-300 hover:text-[#ff4d4d] active:text-[#ff4d4d]">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
