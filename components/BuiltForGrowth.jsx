import { Globe, Layers, Share2, TrendingUp, Handshake, Award } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

const features = [
  {
    icon: Globe,
    title: "Global Perspective",
    text: "Experience and opportunities across international markets.",
  },
  {
    icon: Layers,
    title: "Diverse Expertise",
    text: "Specialized companies serving distinct business sectors.",
  },
  {
    icon: Share2,
    title: "Shared Resources",
    text: "Group-wide technology, leadership and operational support.",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Growth",
    text: "Strong relationships built through transparency and reliability.",
  },
  {
    icon: Handshake,
    title: "Trusted Partnerships",
    text: "Strong relationships built through transparency and reliability.",
  },
  {
    icon: Award,
    title: "Quality Standards",
    text: "One commitment to excellence across every company.",
  },
];

export default function BuiltForGrowth() {
  return (
    <section id="growth" className="bg-[url('/images/buildForGrowth-bg.png')] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col items-center gap-8 px-6 py-10 sm:gap-[3.125rem] sm:py-20 lg:px-16 xl:px-[15.625rem] xl:py-[7.5rem]">
        <div className="flex max-w-[56.625rem] flex-col gap-4 text-center sm:gap-[1.875rem]">
          <h2 className="font-oxanium text-[clamp(1.625rem,7.4vw,2.25rem)] font-bold leading-tight sm:text-4xl md:text-[3.125rem] md:leading-[3.75rem]">
            Built for Growth. <span className="text-[#b80100]">Connected by Purpose.</span>
          </h2>
          <p className="font-poppins text-base text-[#b2b2b2] lg:text-[max(1.125rem,15px)]">
            Each company operates with focused expertise while benefiting from the shared vision,
            leadership and global resources of Way Wise Global.
          </p>
        </div>

        {/* Phones use a compact row card with the glow anchored to the bottom; group-active
            mirrors the hover state for touch. 1024–1279px tightens padding and titles so three
            columns fit. */}
        <div className="grid w-full max-w-[106.25rem] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10 xl:gap-x-8 xl:gap-y-10 2xl:gap-x-10 2xl:gap-y-12">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group relative flex flex-col gap-6 overflow-hidden rounded-[0.625rem] border-b-[3px] border-[#b80100] bg-[#1b1b1b] p-6 max-sm:flex-row max-sm:items-center max-sm:gap-4 max-sm:p-5 max-sm:transition-transform max-sm:duration-200 max-sm:active:scale-[0.98] sm:gap-10 sm:p-10 lg:p-8 xl:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[10.625rem] size-[37.5rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(184,1,0,0.80)_0%,rgba(184,1,0,0.50)_30%,rgba(184,1,0,0.22)_55%,rgba(184,1,0,0)_78%)] max-sm:top-auto max-sm:bottom-[-34.5rem]"
              />

              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-full size-[43.75rem] -translate-x-1/2 rounded-full bg-[#b80100] transition-transform duration-500 ease-out group-hover:-translate-y-[80%] group-active:-translate-y-[80%]"
              />

              <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl border border-[#2e2e2e] bg-[#242424] text-white transition-colors duration-500 group-hover:border-white group-hover:bg-[#BA090C] group-active:border-white group-active:bg-[#BA090C] max-sm:size-14">
                <Icon size={38} strokeWidth={1.5} aria-hidden className="size-[2.375rem]" />
              </div>

              <div className="relative flex flex-col gap-1.5">
                <h3 className="font-oxanium text-xl font-medium tracking-[-0.01125rem] max-sm:text-lg sm:text-2xl lg:text-[1.375rem] xl:text-2xl">
                  {title}
                </h3>

                <p
                  className={`${inter.className} text-[max(1rem,14px)] text-[#a5a5a5] transition-colors duration-500 group-hover:text-white group-active:text-white max-sm:text-sm`}
                >
                  {text}
                </p>
                
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}