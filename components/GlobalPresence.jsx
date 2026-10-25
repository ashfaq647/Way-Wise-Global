import Image from "next/image";
import Link from "next/link";

// Card images are exported without the location label; the label is rendered in code.
const countries = [
  {
    name: "United States",
    image: "/images/country-usa.png", // Figma node 1:1627
    alt: "United States skyline",
    className: "aspect-[4/3] sm:aspect-auto sm:row-span-2", // tall card on the left (640px+)
    labelBottom: "bottom-3 sm:bottom-5",
  },
  {
    name: "United Arab Emirates",
    image: "/images/country-uae.png", // Figma node 1:1634
    alt: "Construction site in the UAE",
    className: "aspect-[335/226] sm:aspect-auto",
    labelBottom: "bottom-3 sm:bottom-[0.9375rem]",
  },
  {
    name: "Asia",
    image: "/images/country-asia.png", // Figma node 1:1639
    alt: "Cargo port in Asia",
    className: "aspect-[335/226] sm:aspect-auto",
    labelBottom: "bottom-3 sm:bottom-[0.9375rem]",
  },
];

function PinIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="size-[1.125rem] shrink-0 sm:size-6"
    >
      <path
        d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.3" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

export default function GlobalPresence() {
  return (
    <section id="global" className="bg-[url('/images/globalpresence-bg.png')] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col items-center gap-10 px-6 py-10 sm:gap-12 sm:py-20 lg:px-16 xl:flex-row xl:gap-[4.375rem] xl:px-[15.625rem] xl:py-[7.5rem]">
        {/* Capped to the card width while stacked so both columns line up */}
        <div className="flex w-full min-w-0 max-w-[43.375rem] flex-1 flex-col items-start gap-6 sm:gap-10 xl:max-w-none">
          <h2 className="font-oxanium text-[clamp(1.4375rem,6.6vw,2.25rem)] font-bold leading-tight sm:text-4xl md:text-[3.125rem] md:leading-[3.75rem]">
            One Vision.
            <br />
            Multiple Industries.
            <br />
            <span className="text-[#e00000]">Global Opportunities.</span>
          </h2>

          <p className="font-poppins text-base text-[#b2b2b2] lg:text-[max(1.125rem,15px)] xl:max-w-[38rem]">
            Way Wise Global is a diversified international group developing businesses across
            multiple industries and markets. Our companies combine focused expertise with shared
            leadership, technology and operational support to create sustainable long-term value.
          </p>

          <Link
            href="#about"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#b80100] px-[1.875rem] font-oxanium text-[max(1rem,14px)] leading-[1.5] font-bold capitalize text-white transition-colors duration-450 delay-150 hover:bg-[#660100] sm:w-auto"
          >
            Discover our story
          </Link>
        </div>

        <div className="grid w-full min-w-0 max-w-[43.375rem] grid-cols-1 gap-4 sm:aspect-[694/476] sm:grid-cols-2 sm:grid-rows-2 lg:gap-6 xl:flex-1">
          {countries.map((c) => (
            <div
              key={c.name}
              className={`relative overflow-hidden rounded-[0.625rem] bg-black ${c.className}`}
            >
              <Image
                src={c.image}
                alt={c.alt}
                fill
                sizes="(min-width: 1280px) 18vw, (min-width: 768px) 340px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                className={`absolute left-3 right-3 flex items-center gap-[0.3125rem] sm:left-5 ${c.labelBottom}`}
              >
                <PinIcon />
                <p className="font-oxanium text-base font-semibold tracking-[-0.01em] sm:text-[1.375rem]">
                  {c.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
