import Image from "next/image";

// Chairman and CEO messages in one section (Figma 33:1003 "Message"). Replaces the
// separate VisionChairman and CeoStatement sections.
//
// From 1280px: the two blocks side by side at Figma size (rem, so they scale with the root
// font size like the rest of the page). 768-1279px: blocks stacked, photo beside text.
// Below 768px: photo above text. Heights always follow the content.

const leaders = [
  {
    title: "Vision That Moves",
    highlight: "Businesses Forward.",
    intro:
      "Way Wise Global builds strong businesses, creates opportunities, and connects global markets through trust, innovation, and leadership.",
    messageTitle: "Chairman Message",
    message:
      "At Way Wise Global, we turn bold visions into successful businesses. Driven by strong values and the right people, we create lasting value, solve real market needs, and unlock new opportunities across industries.",
    name: "Firoz Bari,",
    role: "Chairman, Way Wise Global",
    // export of Figma node 33:1009
    image: "/images/chairman-portrait.png",
    alt: "Firoz Bari, Chairman of Way Wise Global",
    radius: "rounded-[0.6rem]",
  },
  {
    id: "ceo",
    title: "CEO’s",
    highlight: "Statement",
    intro:
      "Technology drives transformation. We build solutions that solve today’s challenges and shape a better future, guided by ethics, data privacy, and sustainability.",
    messageTitle: "CEO Message",
    message:
      "Driven by passion and powered by technology, we turn challenges into opportunities and innovation into lasting impact.",
    name: "Seung Lee,",
    role: "CEO, Way Wise Global",
    // export of Figma node 33:1027
    image: "/images/ceo-portrait.png",
    alt: "Seung Lee, CEO of Way Wise Global",
    radius: "rounded-[0.64rem]",
  },
];

function Leader({ leader }) {
  return (
    <article
      id={leader.id}
      className="flex flex-col-reverse gap-8 md:flex-row md:items-start xl:min-w-0 xl:flex-1 xl:gap-[1.8125rem]"
    >
      {/* Photo with the pink card behind it. Figma: two 220.8 x 345.6 cards, the photo
          offset 19.2px right and down, so the pair is 240 x 364.8. */}
      <div className="relative aspect-[240/364.8] w-[15rem] shrink-0 self-center md:self-start">
        <div className="absolute left-0 top-0 h-[94.737%] w-[92%] rounded-[0.6rem] bg-[#b27b7b]" />
        <div
          className={`absolute bottom-0 right-0 h-[94.737%] w-[92%] overflow-hidden bg-[#c18f8f] ${leader.radius}`}
        >
          <Image
            src={leader.image}
            alt={leader.alt}
            fill
            sizes="(min-width: 1280px) 11.5vw, 221px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-6">
          <h2 className="font-oxanium text-4xl font-bold leading-tight xl:text-[2.625rem] xl:leading-[normal]">
            {leader.title}
            <br />
            <span className="text-[#b80100]">{leader.highlight}</span>
          </h2>
          <p className="font-poppins text-base text-[#b2b2b2] xl:text-[max(1.125rem,15px)]">
            {leader.intro}
          </p>
        </div>

        {/* border-t makes the thin divider line */}
        <div className="flex flex-col gap-6 border-t border-[#2e2e2e] pt-6">
          <h3 className="font-oxanium text-2xl font-medium">{leader.messageTitle}</h3>
          <blockquote className="border-l-[3px] border-[#b80100] pl-6 font-poppins text-[max(1rem,14px)] leading-[1.5] italic text-[#b2b2b2]">
            {leader.message}
          </blockquote>
        </div>

        {/* Name and title */}
        <div className="border-t border-[#2e2e2e] pt-6">
          <p className="font-oxanium text-2xl font-semibold text-[#b80100]">{leader.name}</p>
          <p className="font-poppins text-[1.125rem] italic">{leader.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function LeadershipMessage() {
  return (
    <section
      id="vision"
      className="bg-[#060606] bg-[url('/images/vision-bg.png')] bg-cover bg-bottom bg-no-repeat text-white xl:bg-[length:100%_auto]"
    >
      <div className="mx-auto flex max-w-[51rem] flex-col gap-16 px-6 py-10 sm:py-20 xl:max-w-[120rem] xl:flex-row xl:items-start xl:gap-[3.75rem] xl:px-[15rem] xl:pb-[16.0625rem] xl:pt-[16.125rem]">
        {leaders.map((leader) => (
          <Leader key={leader.name} leader={leader} />
        ))}
      </div>
    </section>
  );
}
