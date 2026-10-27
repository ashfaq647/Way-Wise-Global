// Stacked below 1100px, side by side above (columns capped at the Figma 664px / 591px).
// The collage is a size container: the rating card scales with it via cqw, clamped so it
// stays readable on small screens.

import Image from "next/image";
import Link from "next/link";
import CountUp from "./CountUp";
import {
  Space_Grotesk,
  Inter,
  Plus_Jakarta_Sans,
  Cal_Sans,
} from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], weight: ["400"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500"] });
const calSans = Cal_Sans({ subsets: ["latin"], weight: ["400"] });

const stats = [
  {
    value: 8,
    digits: 2,
    prefix: "",
    suffix: "+",
    title: "Group Companies",
    sub: "Growing Business Portfolio",
  },
  {
    value: 3,
    digits: 2,
    prefix: "",
    suffix: "",
    title: "Global Markets",
    sub: "USA · UAE · Bangladesh",
  },
  {
    value: 39,
    digits: 2,
    prefix: "",
    suffix: "+",
    title: "Skilled Professionals",
    sub: "International Expertise",
  },
  {
    value: 100,
    digits: 3,
    prefix: "",
    suffix: "%",
    title: "Growth Focused",
    sub: "One Shared Vision",
  },
];

// Dividers per stat item (only ever added, never removed, so breakpoints can't conflict):
// mobile (1 col)    -> horizontal line under items 0, 1, 2
// sm–lg (2x2)       -> vertical line after the left column (items 0, 2)
// lg+ (1x4, Figma)  -> vertical line after items 0, 1, 2
const statDividers = [
  "border-b sm:border-b-0 sm:border-r",
  "border-b sm:border-b-0 lg:border-r",
  "border-b sm:border-b-0 sm:border-r",
  "",
];

function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#FFA500" aria-hidden className="size-4">
      <path d="M8 1.3l2 4.4 4.8.5-3.6 3.2 1 4.7L8 11.6 3.8 14.1l1-4.7L1.2 6.2l4.8-.5L8 1.3z" />
    </svg>
  );
}

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-black text-white"
    >
      <Image
        src="/images/footer-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-100"
      />

      <div className="mx-auto max-w-[120rem] px-6 py-10 sm:py-20 lg:px-16 xl:px-[12.5rem] xl:py-[7.5rem]">
      
        {/* From sm to below lg: content above, image below.
        From lg and above: image left, content right. */}
       <div className="flex flex-col-reverse items-center gap-16 pb-20 min-[1100px]:flex-row min-[1100px]:justify-center min-[1100px]:gap-[6vw] xl:gap-[10.1875rem] xl:pb-[7.5rem]">
          {/* ---------- Collage (664 x 610) ---------- */}
          <div
            className="relative aspect-[664/610] w-full min-w-0 max-w-[41.5rem] min-[1100px]:flex-1 min-[1100px]:basis-0"
            style={{ containerType: "inline-size" }}
          >
            {/* Laptop photo */}
            <div className="absolute left-0 top-[19.5%] h-[77.9%] w-[53.3%] overflow-hidden rounded-[1.25rem] border border-[#d8dde1]">
              <Image
                src="/images/about-laptop.png"
                alt="Laptop showing a world map"
                fill
                sizes="(min-width: 1100px) 354px, 50vw"
                className="object-cover"
              />
            </div>

            {/* Ship photo */}
            <div className="absolute right-0 top-0 h-[52.5%] w-[41.7%] overflow-hidden rounded-[1.25rem] border border-[#d8dde1]">
              <Image
                src="/images/about-ship.png"
                alt="Cargo ship in a port"
                fill
                sizes="(min-width: 1100px) 277px, 40vw"
                className="object-cover"
              />
            </div>

            {/* Rating card: gap, padding, radius and text all shrink with the collage.
                Up to 450px it sits 12px lower so the two-line text doesn't push it into the ship photo. */}
            <div className="absolute bottom-[-1.25rem] right-0 max-[451px]:bottom-[-2rem] flex w-[41.7%] flex-col items-center gap-[clamp(0.5rem,2.86cqw,1.1875rem)] rounded-[clamp(1rem,4.5cqw,1.875rem)] border border-[#d8dde1] bg-white px-[8.13%] py-[clamp(0.875rem,5.12cqw,2.125rem)]">
              <div className="flex w-full flex-col items-center gap-[clamp(0.5rem,3.3cqw,1.375rem)]">
                <p
                  className={`${calSans.className} w-full text-center leading-[0.763] text-[#b80100]`}
                  style={{ fontSize: "clamp(1.75rem, 11.45cqw, 4.75rem)" }}
                >
                  4.9
                </p>
              </div>
              <Image
                src="/images/123.png"
                alt="Happy customers"
                width={169}
                height={52}
                sizes="169px"
                style={{ width: "100%", height: "auto" }}
              />

              <div className="flex w-full flex-col items-center gap-1.5">
                <div className="flex items-center justify-center gap-[0.05rem]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>

                <p
                  className={`${jakarta.className} whitespace-nowrap text-center text-[length:clamp(0.625rem,2.1cqw,1rem)] xl:text-[length:clamp(12px,2.41cqw,1rem)] font-medium leading-tight text-[#b80100]`}
                >
                  2k+ satisfied
                  <br className="min-[451px]:hidden" />{" "}
                  customers
                </p>
              </div>
            </div>

            <Image
              src="/images/about-badge.svg"
              alt="Way-Wise Global"
              width={170}
              height={170}
              sizes="170px"
              style={{ height: "auto" }}
              className="absolute left-[41.7%] top-[38.4%] w-[25.6%]"
            />
          </div>

          {/* ---------- Text (591px) ---------- */}
          <div className="flex w-full min-w-0 max-w-[41.5rem] flex-col gap-[1.875rem] min-[1100px]:max-w-[36.9375rem] min-[1100px]:flex-1 min-[1100px]:basis-0">
            <div className="flex flex-col gap-[1.3125rem] border-b border-[#656565] pb-6">
              <h2 className="font-oxanium text-4xl font-bold leading-tight min-[1100px]:text-5xl min-[1100px]:leading-[3.625rem]">
                About Us
              </h2>
              <div className="flex flex-col gap-4 font-poppins text-base leading-[max(1.5625rem,22px)] min-[1100px]:text-[max(1.125rem,16px)]">
                <p>
                  Way Wise Global brings together technology, construction, real
                  estate, trading, recruitment, and consumer ventures under one
                  shared vision for sustainable global growth. What started as a
                  small venture with big dreams has grown into a dynamic company
                  dedicated to delivering excellence.
                </p>
                <p>
                  Fueled by passion and a commitment to quality, we’ve built a
                  team of experts who share our values and vision. Along the
                  way, we’ve embraced challenges, celebrated milestones, and
                  formed lasting partnerships that inspire us to continue
                  evolving.
                </p>
              </div>
            </div>

            <Link
              href="/#about"
              className="group flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#b80100] px-[1.875rem] py-[0.625rem] font-oxanium text-[max(1rem,14px)] font-bold capitalize leading-6 text-white transition-colors duration-300 ease-out hover:bg-[#660100] focus-visible:bg-[#660100]"
            >
              Know More
              {/* Two arrows in a one-arrow window; hover slides the strip to swap them */}
              <span
                aria-hidden
                className="relative block size-6 overflow-hidden"
              >
                <span className="flex w-12 -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0">
                  {[0, 1].map((i) => (
                    <svg
                      key={i}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-6 shrink-0"
                    >
                      <path
                        d="M12 5L19 12L12 19M5 12H19"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* ---------- Stats bar ---------- */}
        {/* 1 col on mobile, 2x2 from sm, 4 in a row (Figma) from lg */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/50 bg-white/[0.04] p-5 backdrop-blur-sm sm:grid-cols-2 sm:gap-y-6 sm:p-7 lg:grid-cols-4 lg:gap-y-0 lg:p-8">
          {stats.map((s, i) => (
            <div
              key={s.title}
              className={`relative flex flex-col items-center gap-4 border-white/15 px-3 py-4 text-center sm:px-5 lg:px-4 xl:px-8 ${statDividers[i]}`}
            >
              <CountUp
                from={0}
                to={s.value}
                digits={s.digits}
                prefix={s.prefix}
                suffix={s.suffix}
                mode="roll"
                easing="easeOut"
                duration={2}
                delay={i * 0.12}
                trigger="view"
                className={`${spaceGrotesk.className} text-4xl font-bold leading-none tracking-[-0.045em] text-[#e00000] tabular-nums sm:text-5xl xl:text-[3.25rem]`}
              />

              <div className="flex flex-col items-center gap-[0.3125rem]">
                <p
                  className={`${spaceGrotesk.className} text-[max(0.9375rem,13px)] font-semibold leading-[max(1.40625rem,18px)] tracking-[0.01em] text-white`}
                >
                  {s.title}
                </p>

                <p
                  className={`${inter.className} text-[max(0.8125rem,12px)] leading-[max(1.21875rem,16px)] tracking-[0.02em] text-[#a5a5a5]`}
                >
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
