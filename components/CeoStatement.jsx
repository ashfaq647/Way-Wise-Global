// Mirror of VisionChairman: text on the left, photo on the right.

import Image from "next/image";

export default function CeoStatement() {
  return (
    <section id="ceo" className="bg-[#0f0f0f] text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col items-center justify-center gap-12 px-6 py-10 sm:py-20 lg:px-16 min-[1100px]:flex-row min-[1100px]:gap-[7vw] xl:gap-[8.75rem] xl:px-[18.125rem] xl:py-[8.875rem]">
        {/* ---------- Left: text ---------- */}
        <div className="order-2 flex w-full max-w-[43.75rem] flex-col gap-6 min-[1100px]:order-1">
          <div className="flex flex-col gap-6">
            <h2 className="font-oxanium text-4xl font-bold leading-tight md:text-[3.125rem] md:leading-[3.75rem]">
              CEO’s
              <br />
              <span className="text-[#b80100]">Statement</span>
            </h2>
            <p className="font-poppins text-base text-[#b2b2b2] min-[1100px]:text-[max(1.125rem,15px)]">
              In today’s fast-changing world, technology is more than innovation—it’s
              transformation. We create solutions that solve today’s challenges while shaping a
              better future, guided by ethics, data privacy, and sustainability.
            </p>
          </div>

          {/* Quote (border-t = thin divider line) */}
          <div className="flex flex-col gap-6 border-t border-[#2e2e2e] pt-10">
            <blockquote className="flex flex-col gap-4 border-l-[3px] border-[#b80100] pl-6 font-poppins text-[max(1rem,14px)] leading-[1.5] italic text-[#b2b2b2]">
              <p>
                Our passionate team fuels this mission, turning challenges into opportunities and
                progress into impact.
              </p>
              <p>
                Thank you for joining us as we harness technology to make a positive difference.
              </p>
            </blockquote>
          </div>

          {/* Name and title */}
          <div className="border-t border-[#2e2e2e] pt-6">
            <p className="font-oxanium text-2xl font-semibold text-[#b80100]">Seung Lee,</p>
            <p className="font-poppins text-[1.125rem] italic">CEO, Way Wise Global</p>
          </div>
        </div>

        {/* ---------- Right: photo with the pink card behind it (mirrored) ---------- */}
        <div className="relative order-1 aspect-square w-full max-w-[31.25rem] shrink-0 min-[1100px]:order-2">
          {/* Pink card: top-right */}
          <div className="absolute right-0 top-0 h-[90%] w-[90%] rounded-[0.70313rem] bg-[#b27b7b]" />

          {/* CEO photo: export node 31:2087 -> public/images/ceo.png */}
          <div className="absolute bottom-0 left-0 h-[90%] w-[90%] overflow-hidden rounded-[0.70313rem] bg-[#faaaaa]">
            <Image
              src="/images/ceo.png"
              alt="Seung Lee, CEO of Way Wise Global"
              fill
              sizes="(min-width: 1100px) 450px, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}