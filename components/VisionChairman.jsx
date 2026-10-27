import Image from "next/image";

export default function VisionChairman() {
  return (
    <section id="vision" className="bg-[url('/images/vision-bg.png')] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col-reverse items-center justify-center gap-12 px-6 py-10 sm:py-20 min-[1100px]:flex-row lg:px-16 lg:gap-[7vw] xl:gap-[8.75rem] xl:px-[18.125rem] xl:py-[7.5rem]">
        {/* ---------- Left: photo with the pink card behind it ---------- */}
        <div className="relative aspect-square w-full max-w-[31.25rem] shrink-0">
          {/* Pink card behind (pure CSS, no image needed) */}
          <div className="absolute left-0 top-0 h-[90%] w-[90%] rounded-[0.70313rem] bg-[#b27b7b]" />

          {/* Chairman photo: export node 1:1688 -> public/images/chairman.png */}
          <div className="absolute bottom-0 right-0 h-[90%] w-[90%] overflow-hidden rounded-[0.70313rem] bg-[#faaaaa]">
            <Image
              src="/images/chairman.png"
              alt="Firoz Bari, Chairman of Way Wise Global"
              fill
              sizes="(min-width: 1100px) 450px, 90vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* ---------- Right: text ---------- */}
        <div className="flex w-full max-w-[43.75rem] flex-col gap-6">
          <div className="flex flex-col gap-6">
            <h2 className="font-oxanium text-4xl font-bold leading-tight md:text-[3.125rem] md:leading-[3.75rem]">
              Vision That Moves
              <br />
              <span className="text-[#b80100]">Businesses Forward.</span>
            </h2>
            <p className="font-poppins text-base text-[#b2b2b2] min-[1100px]:text-[max(1.125rem,15px)]">
              Way Wise Global is guided by a long-term vision to build strong companies, create
              meaningful opportunities, and connect global markets through trust, innovation, and
              responsible leadership.
            </p>
          </div>

          {/* Chairman message (border-t makes the thin divider line) */}
          <div className="flex flex-col gap-6 border-t border-[#2e2e2e] pt-10">
            <h3 className="font-oxanium text-2xl font-medium">Chairman Message</h3>
            <blockquote className="border-l-[3px] border-[#b80100] pl-6 font-poppins text-[max(1rem,14px)] leading-[1.5] italic text-[#b2b2b2]">
              At Way Wise Global, we believe every successful business begins with a clear vision,
              strong values, and the right people. Our goal is to build companies that solve real
              market needs, create long-term value, and open new opportunities across technology,
              construction, real estate, trading, recruitment, and consumer sectors.
            </blockquote>
          </div>

          {/* Name and title */}
          <div className="border-t border-[#2e2e2e] pt-6">
            <p className="font-oxanium text-2xl font-semibold text-[#b80100]">Firoz Bari,</p>
            <p className="font-poppins text-[1.125rem] italic">Chairman, Way Wise Global</p>
          </div>
        </div>
      </div>
    </section>
  );
}