import { Fragment } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

// textWidth is the Figma text box width, so each description breaks into 3 lines as designed.
// xl (1280–1535px) drops the cap so the text can use the whole content block; 2xl brings it back.
const steps = [
  {
    number: "01",
    title: "Identify Opportunities",
    text: "We explore market needs, emerging sectors and meaningful business possibilities.",
    textWidth: "lg:max-w-[17.0625rem] xl:max-w-none 2xl:max-w-[17.0625rem]",
  },
  {
    number: "02",
    title: "Build Expertise",
    text: "We develop specialized companies supported by experienced teams.",
    textWidth: "lg:max-w-[14.125rem] xl:max-w-none 2xl:max-w-[14.125rem]",
  },
  {
    number: "03",
    title: "Connect Resources",
    text: "We combine technology, leadership and operational capabilities.",
    textWidth: "lg:max-w-[13.9375rem] xl:max-w-none 2xl:max-w-[13.9375rem]",
  },
  {
    number: "04",
    title: "Create Lasting Value",
    text: "We grow businesses through quality, trust and long-term thinking.",
    textWidth: "lg:max-w-[14.5rem] xl:max-w-none 2xl:max-w-[14.5rem]",
  },
];

export default function HowWeBuild() {
  return (
    <section id="process" className="bg-[url('/images/howWeBuild-bg.png')] bg-cover bg-center text-white">
      {/* xl (1280–1535px): small side padding so the 4 columns get Figma-size text.
          2xl (1536px+): back to the Figma 250px. */}
      <div className="mx-auto flex max-w-[120rem] flex-col items-center gap-8 px-6 pt-14 pb-6 sm:gap-[3.125rem] sm:py-12 lg:px-16 xl:px-10 xl:py-[7.5rem] 2xl:px-[15.625rem]">
        <div className="flex max-w-[56.625rem] flex-col gap-2.5 text-center">
          <h2 className="font-oxanium text-[clamp(1.625rem,7.4vw,2.25rem)] font-bold leading-tight sm:text-4xl md:text-[3.125rem] md:leading-[3.75rem]">
            How We Build Lasting <span className="text-[#b80100]">Business Value</span>
          </h2>
          <p className="font-poppins text-base text-[#b2b2b2] lg:text-[max(1.125rem,15px)]">
            Our international network combines local market experience with a connected global
            approach.
          </p>
        </div>

        {/* 1 column below 768px, 2x2 grid to 1279px, 4 columns from 1280px. Steps stretch to
            equal height so numbers and titles align. */}
        <div className="flex w-full max-w-[88.75rem] flex-col items-stretch overflow-hidden rounded-2xl border border-[#2e2e2e] md:grid md:grid-cols-[minmax(0,1fr)_0.125rem_minmax(0,1fr)] xl:flex xl:flex-row">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
          
              {/* In the 2x2 grid the divider between rows is hidden */}
              {i > 0 && (
                <div
                  aria-hidden
                  className={`h-[0.125rem] w-[11.5rem] shrink-0 self-center bg-[#b80100] max-md:hidden md:justify-self-center ${
                    i === 2 ? "md:hidden xl:block" : "md:h-[11.5rem] md:w-0 md:border-l-2 md:border-[#b80100]"
                  } xl:h-[11.5rem] xl:w-0 xl:border-l-2 xl:border-[#b80100]`}
                />
              )}

              {/* xl: every cell centers a same-width content block, so each red bar has equal
                  space on both sides. 2xl: back to the Figma padding. */}
              <div className="group flex flex-1 bg-black/20 p-6 backdrop-blur-[0.125rem] sm:p-10 xl:justify-center xl:px-0 2xl:justify-start 2xl:px-10">
                {/* 2x2: content block centered in the cell so the red bar sits visually in the middle */}
                <div className="flex w-full flex-col gap-5 sm:gap-[1.875rem] md:mx-auto md:max-w-[17.0625rem] xl:mx-0 xl:max-w-[16rem] 2xl:max-w-none">
                  <p className="font-oxanium text-[3rem] font-bold leading-[2.75rem] text-transparent transition-all duration-300 [-webkit-text-stroke:1.5px_#3a3a3a] group-hover:[-webkit-text-stroke:1.5px_#b80100] group-active:[-webkit-text-stroke:1.5px_#b80100] sm:text-[4rem] sm:leading-[3.5rem]">
                    {step.number}
                  </p>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <h3 className="font-oxanium text-xl font-medium leading-tight tracking-[-0.01125rem] transition-colors duration-300 group-hover:text-[#b80100] group-active:text-[#b80100] sm:text-2xl sm:leading-[1.35rem]">
                      {step.title}
                    </h3>
                    <p
                      className={`${inter.className} text-[max(1rem,14px)] leading-[max(1.4375rem,20px)] text-[#b2b2b2] ${step.textWidth}`}
                    >
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}