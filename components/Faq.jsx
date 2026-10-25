"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

// TODO: Figma only provides one real answer; the remaining entries are placeholders.
const ANSWER =
  "Way Wise Global operates across technology and digital transformation, construction and development, technical and property services, real estate and investment, international trade, recruitment and workforce, food and consumer products, and fashion and lifestyle industries.";

const faqs = [
  {
    question: "Where does Way Wise Global operate?",
    answer: "Way Wise Global operates across the United States, the United Arab Emirates and Asia.",
  },
  {
    question: "What industries does Way Wise Global operate in?",
    answer: ANSWER,
  },
  {
    question: "Where does Way Wise Global operate?",
    answer: "Way Wise Global operates across the United States, the United Arab Emirates and Asia.",
  },
  {
    question: "Where does Way Wise Global operate?",
    answer: "Way Wise Global operates across the United States, the United Arab Emirates and Asia.",
  },
  {
    question: "Where does Way Wise Global operate?",
    answer: "Way Wise Global operates across the United States, the United Arab Emirates and Asia.",
  },
];

export default function Faq() {
  // null = all closed
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[url('/images/Faq-bg.png')] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col items-center gap-10 px-6 py-10 sm:gap-12 sm:py-20 lg:flex-row lg:gap-[3.25rem] lg:px-16 xl:px-[15.625rem] xl:py-[7.5rem]">
        <div className="flex w-full flex-col gap-8 sm:gap-12 lg:flex-1 xl:max-w-[41.875rem] xl:w-[41.875rem] xl:flex-initial xl:gap-20">
          <div className="flex flex-col gap-4 sm:gap-[1.875rem]">
            <h2 className="font-oxanium text-[clamp(1.625rem,7.4vw,2.25rem)] font-bold leading-tight sm:text-4xl md:text-[3.125rem] md:leading-[3.75rem]">
              Learn More About
              <br />
              <span className="text-[#b80100]">Way Wise Global</span>
            </h2>
            <p className="font-poppins text-base text-[#b2b2b2] lg:text-[max(1.125rem,15px)]">
              Every Way Wise company focuses on its own industry while benefiting from shared
              leadership, technology, market access and operational support.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`border border-[#2e2e2e] bg-black/20 p-4 backdrop-blur-[0.1875rem] transition-[border-radius] duration-300 ${
                    isOpen ? "rounded-lg" : "rounded-md"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="flex w-full items-center justify-between gap-4 py-1 text-left max-sm:min-h-11"
                  >
                    <span
                      className={`${inter.className} text-[max(1rem,15px)] leading-[1.5] font-medium ${
                        isOpen ? "text-white" : "text-[#f2f2f2]"
                      }`}
                    >
                      {item.question}
                    </span>

                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen
                          ? "border-[#e00000] bg-[#e00000] text-white"
                          : "border-[#4d0000] text-[#e00000]"
                      }`}
                    >
                      {isOpen ? (
                        <Minus size={12} strokeWidth={2} className="size-3" />
                      ) : (
                        <Plus size={12} strokeWidth={2} className="size-3" />
                      )}
                    </span>
                  </button>

                  {/* Animating grid rows 0fr -> 1fr gives a height transition without measuring */}
                  <div
                    id={`faq-answer-${i}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`${inter.className} pb-4 pt-3 text-[max(1rem,14px)] leading-[max(1.4875rem,21px)] text-[#a5a5a5] sm:pb-5 sm:pt-4`}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 640–1023px uses a wide 16/10 crop so the stacked photo isn't excessively tall */}
        <div className="relative aspect-[698/821] w-full shrink-0 overflow-hidden rounded-[0.625rem] border border-[#2e2e2e] bg-[#0d0d0d] sm:aspect-[16/10] lg:aspect-[698/821] lg:w-[46%] xl:w-[43.625rem] xl:shrink">
          <Image
            src="/images/faq.png"
            alt="Neon info sign"
            fill
            sizes="(min-width: 1280px) 37vw, (min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}