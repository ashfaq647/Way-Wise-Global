import Image from "next/image";
import { PartnerWithUsLink } from "@/components/PartnerWithUs";

const CTA = {
  title: "Ready To Build the Next Opportunity Together?",
  text: "Connect with Way Wise Global for business partnerships, specialized services and international collaboration.",
  button: { label: "Partner with us", href: "/#contact" },
  image: "/images/cta-bg.png",
};

export default function CtaBanner() {
  return (
    <section id="contact" className="relative isolate overflow-hidden">
      <Image
        src={CTA.image}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-left"
      />

      {/* Below 640px the text overlaps the bright part of the photo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/25 sm:hidden" />

      <div className="mx-auto flex max-w-[120rem] flex-col items-end px-6 py-10 sm:py-16 md:py-20 lg:px-16 xl:px-[15.625rem] xl:py-[7.5rem]">
        <div className="flex w-full flex-col items-start gap-8 sm:gap-[3.125rem] lg:w-[50rem] lg:max-w-[60%] xl:max-w-none">
          <div className="flex w-full flex-col gap-[0.9375rem] text-white">
            <h2 className="font-oxanium text-[clamp(1.5rem,7.4vw,1.875rem)] font-bold leading-normal sm:text-3xl md:text-4xl xl:text-[3.125rem]">
              {CTA.title}
            </h2>
            <p className="font-poppins text-base md:text-[max(1.125rem,15px)]">{CTA.text}</p>
          </div>

          <PartnerWithUsLink
            href={CTA.button.href}
           className="flex h-14 w-full items-center justify-center rounded-lg px-[2.25rem] py-[0.625rem] font-oxanium text-[max(1rem,14px)] font-bold capitalize leading-6 text-white ring-1 ring-inset ring-white transition-[background-color,box-shadow] duration-500 ease-out hover:bg-white/10 hover:ring-[0.5px] focus-visible:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            {CTA.button.label}
          </PartnerWithUsLink>
        </div>
      </div>
    </section>
  );
}
