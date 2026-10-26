"use client";

// Stacked below 1024px; above that the diagram (max 698 x 610, as in Figma) and the text
// share the row equally.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PartnerWithUsLink } from "@/components/PartnerWithUs";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"], weight: ["500"] });

// Time between two highlights (milliseconds)
const AUTO_MS = 3000;
// The red light travels exactly 2 times per node, so when the highlight moves on,
// the light has just finished (it never gets cut in the middle).
const PULSE_MS = AUTO_MS / 2;
// The entrance animation needs about 2 seconds. After this time everything is
// forced into its final position (a safety net: nothing can stay invisible).
const SETTLE_MS = 2600;

// The 6 nodes sit on a hexagon. `angle` is measured from the right (3 o'clock), counter-clockwise.
// labelAbove = true puts the label above the circle (like in Figma), false puts it below.
// The ORDER below is clockwise, so the auto highlight walks around the circle.
const RADIUS = 195; // distance from the center, in a 600 x 600 diagram
const nodes = [
  { label: "Technology", icon: "/images/icons/technology.svg", angle: 90, labelAbove: true },
  { label: "Construction", icon: "/images/icons/construction.svg", angle: 30, labelAbove: true },
  { label: "Property", icon: "/images/icons/property.svg", angle: -30, labelAbove: false },
  { label: "Trading", icon: "/images/icons/trading.svg", angle: -90, labelAbove: false },
  { label: "Talent", icon: "/images/icons/talent.svg", angle: -150, labelAbove: false },
  { label: "Consumer", icon: "/images/icons/consumer.svg", angle: 150, labelAbove: true },
].map((n) => {
  const rad = (n.angle * Math.PI) / 180;
  const dx = RADIUS * Math.cos(rad);
  const dy = RADIUS * Math.sin(rad);
  return {
    ...n,
    // position in % of the diagram (used by the node circles)
    left: 50 + (dx / 600) * 100,
    top: 50 - (dy / 600) * 100,
    // position in px inside the 600 x 600 SVG (used by the spokes)
    x: 300 + dx,
    y: 300 - dy,
    // distance from the center in % of the diagram (used by the red light)
    dxPct: (dx / 600) * 100,
    dyPct: (-dy / 600) * 100,
  };
});

const checklist = [
  "Independent Industry Expertise",
  "Shared Group Resources",
  "Connected Global Opportunities",
];

// Exact Figma icon (node 2:1938): open circle + check mark that leaves the circle.
// 20 x 20, stroke 1.33px, color #b2b2b2, round ends.
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="size-5 shrink-0">
      <path
        d="M18.1656 8.3362A8.3333 8.3333 0 1 1 14.1647 2.782"
        stroke="#b2b2b2"
        strokeWidth="1.3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.1667L10 11.6667L18.3333 3.3333"
        stroke="#b2b2b2"
        strokeWidth="1.3333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IndependentExpertise() {
  const [active, setActive] = useState("Technology");
  const [inView, setInView] = useState(false); // diagram was (mostly) on screen once -> entrance starts
  const [visible, setVisible] = useState(false); // diagram is on screen RIGHT NOW (animations run only then)
  const [settled, setSettled] = useState(false); // entrance is finished -> everything is final
  const [reduce, setReduce] = useState(false); // visitor has "reduce motion" turned on
  const [hovering, setHovering] = useState(false); // mouse is over the diagram
  const [touchTick, setTouchTick] = useState(0); // changes every time a finger touches the diagram

  const diagramRef = useRef(null);
  const dotRef = useRef(null);
  const waveRef = useRef(null);
  const nextDelayRef = useRef(AUTO_MS); // how long to wait before the next highlight
  const lastScrollRef = useRef(0); // time of the last page scroll

  // true while the page is scrolling (and 0.3 s after). During that time the mouse may
  // "touch" a node only because the page moved under it -> we ignore such hovers.
  const scrolledRecently = () => Date.now() - lastScrollRef.current < 300;

  // hover (mouse) may only change the highlight when the entrance is finished
  // and the mouse really moved (not because of scrolling)
  const hoverActivate = (label) => {
    if (!settled || scrolledRecently()) return;
    setActive(label);
  };

  // 1) Start the entrance when the diagram is mostly on screen (only once)
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduceMotion);

    const el = diagramRef.current;
    if (!el) return;

    if (reduceMotion) {
      setInView(true); // no animation: show everything at once
      setSettled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // at least half of the diagram is visible (or it fills most of a small window)
        const enough =
          entry.intersectionRatio >= 0.5 ||
          entry.intersectionRect.height >= window.innerHeight * 0.85;
        if (entry.isIntersecting && enough) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 1b) Is the diagram on screen right now? (the red light, the wave and the auto highlight
  //     only run while it is. This keeps the browser light and avoids drawing glitches.)
  useEffect(() => {
    const el = diagramRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2) Remember when the page was scrolled last
  useEffect(() => {
    const onScroll = () => {
      lastScrollRef.current = Date.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 3) Entrance finished -> put everything into its final state (safety net)
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setTimeout(() => setSettled(true), SETTLE_MS);
    return () => clearTimeout(id);
  }, [inView, reduce]);

  // 4) Auto highlight. A NEW timer starts every time the highlight changes (by the timer or by the
  //    visitor), so it always waits the full time. No timer while the mouse is on the diagram
  //    or while the diagram is off screen.
  useEffect(() => {
    if (reduce || !inView || !visible || hovering) return;
    const id = setTimeout(() => {
      nextDelayRef.current = AUTO_MS;
      setActive((current) => {
        const i = nodes.findIndex((n) => n.label === current);
        return nodes[(i + 1) % nodes.length].label;
      });
    }, nextDelayRef.current);
    return () => clearTimeout(id);
  }, [active, inView, visible, reduce, hovering, touchTick]);

  // 5) The red light: starts right away when the diagram appears (the first "pop"), then
  //    travels from the center to the active node, again and again.
  //    It is restarted at the same moment as the timer above, so they stay in sync.
  //    It is a normal <div> that only moves (transform) and fades (opacity): the cheapest
  //    thing for the browser, and the SVG behind it never has to be redrawn.
  useEffect(() => {
    const el = dotRef.current;
    const node = nodes.find((n) => n.label === active);
    if (!el || !node || reduce || !inView || !visible) return;

    const move = el.animate(
      [
        { transform: "translate(0%, 0%)" },
        { transform: `translate(${node.dxPct}%, ${node.dyPct}%)` },
      ],
      { duration: PULSE_MS, iterations: Infinity, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
    );
    const fade = el.animate(
      [
        { opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.15 },
        { opacity: 1, offset: 0.8 },
        { opacity: 0, offset: 1 },
      ],
      { duration: PULSE_MS, iterations: Infinity, easing: "linear" }
    );

    return () => {
      move.cancel();
      fade.cancel();
    };
  }, [active, inView, visible, reduce, hovering, touchTick]);

  // 6) The soft wave from the center logo: starts right away when the diagram appears
  useEffect(() => {
    const el = waveRef.current;
    if (!el || reduce || !inView || !visible) return;
    const wave = el.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0.35 },
        { transform: "translate(-50%, -50%) scale(2.1)", opacity: 0 },
      ],
      { duration: 3600, iterations: Infinity, easing: "linear" }
    );
    return () => wave.cancel();
  }, [inView, visible, reduce]);

  // transition helper: no animation at all when "reduce motion" is on
  const t = (css) => (reduce ? "none" : css);

  return (
    <section id="expertise" className="bg-[url('/images/independentExpertise-bg.png')] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-[120rem] flex-col items-center gap-10 px-6 py-10 sm:gap-12 sm:py-20 lg:flex-row lg:gap-[5vw] lg:px-16 xl:gap-20 xl:px-[15.625rem] xl:py-[6.25rem]">
        {/* ---------- Left: diagram ---------- */}
        <div
          ref={diagramRef}
          // "mouse is over the diagram" only counts when the mouse REALLY moves
          // (not when the page scrolls under a mouse that is not moving)
          onPointerMove={(e) => {
            if (e.pointerType === "mouse" && !scrolledRecently()) setHovering(true);
          }}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
          onPointerDown={(e) => {
            if (e.pointerType === "touch") {
              nextDelayRef.current = AUTO_MS * 3; // after a tap: wait 9 seconds
              setTouchTick((n) => n + 1);
            }
          }}
          className="relative isolate flex w-full min-w-0 max-w-[43.625rem] items-center justify-center rounded-[0.625rem] border border-[#2e2e2e] p-3 sm:p-[1.3125rem] lg:flex-1 lg:basis-0 xl:h-[38.125rem]"
        >
          {/* DRAWING-GLITCH FIX: the blurred glass background is its OWN layer, behind the diagram.
              Before, the blur was on the box that CONTAINS all the moving parts. Chrome can then
              randomly "forget" to draw some of them while you scroll. Same look, but safe. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-[0.625rem] bg-[#030303]/10 backdrop-blur-[1.0625rem]"
          />

          <div className="relative aspect-square w-full max-w-[37.5rem]">
            {/* Rings + spokes (SVG, scales with the box). Nothing in here moves after the
                entrance, so the browser draws it once and leaves it alone. */}
            <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden>
              {/* the 2 rings draw themselves (start at 12 o'clock) */}
              <circle
                cx="300"
                cy="300"
                r="270"
                fill="none"
                stroke="#2e2e2e"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={inView ? 0 : 1}
                transform="rotate(-90 300 300)"
                style={{
                  transition: t(
                    settled ? "none" : "stroke-dashoffset 1500ms cubic-bezier(0.4, 0, 0.2, 1)"
                  ),
                }}
              />
              <circle
                cx="300"
                cy="300"
                r="210"
                fill="none"
                stroke="#2e2e2e"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={inView ? 0 : 1}
                transform="rotate(-90 300 300)"
                style={{
                  transition: t(
                    settled ? "none" : "stroke-dashoffset 1500ms cubic-bezier(0.4, 0, 0.2, 1) 200ms"
                  ),
                }}
              />

              {/* the 6 spokes grow from the center, one after the other */}
              {nodes.map((n, i) => (
                <line
                  key={n.label}
                  x1="300"
                  y1="300"
                  x2={n.x}
                  y2={n.y}
                  stroke={active === n.label ? "#b80100" : "#2e2e2e"}
                  strokeWidth="1.5"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={inView ? 0 : 1}
                  style={{
                    transition: t(
                      settled
                        ? "stroke 300ms"
                        : `stroke 300ms, stroke-dashoffset 800ms ease-out ${500 + i * 120}ms`
                    ),
                  }}
                />
              ))}
            </svg>

            {/* soft wave that leaves the center logo (delete this block if you don't like it) */}
            {!reduce && inView && (
              <div
                ref={waveRef}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 size-[25.33%] rounded-full border border-[#b80100] opacity-0"
                style={{ transform: "translate(-50%, -50%)" }}
              />
            )}

            {/* the red light. This box is as big as the diagram and moves by a % of its own size,
                so the light follows the diagram on every screen size (moved by effect 5). */}
            {!reduce && inView && (
              <div
                ref={dotRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0"
              >
                <span className="absolute left-1/2 top-1/2 size-[1.33%] min-h-1.5 min-w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff3b3b] shadow-[0_0_0.5rem_0.125rem_rgba(224,0,0,0.85)]" />
              </div>
            )}

            {/* Center logo: two rings + the Way-Wise logo (fades + grows in) */}
            <div
              className="absolute inset-[38%] flex items-center justify-center rounded-full border border-[#3a3a3a] bg-[#101010]"
              style={
                settled
                  ? { opacity: 1, transform: "none" }
                  : {
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1)" : "scale(0.7)",
                      transition: t(
                        "opacity 700ms ease-out 150ms, transform 800ms ease-out 150ms"
                      ),
                    }
              }
            >
              <div className="flex h-[83%] w-[83%] items-center justify-center rounded-full border border-[#3a3a3a] bg-[#1b1b1b]">
                {/* Export node 31:2265 from Figma as SVG -> public/images/center.svg */}
                <Image
                  src="/images/center.svg"
                  alt="Way-Wise Global"
                  width={66}
                  height={66}
                  className="h-auto w-[55%]"
                />
              </div>
            </div>

            {/* Nodes are larger below 640px to keep them tappable */}
            {nodes.map(({ label, icon, left, top, labelAbove }, i) => {
              const isActive = active === label;
              return (
                <div
                  key={label}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isActive ? "size-[14%] sm:size-[12%]" : "size-[11%] sm:size-[9%]"
                  }`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                >
                  {/* inner box = the pop-in animation.
                      After the entrance (settled) it is simply "visible", no animation left. */}
                  <div
                    className="relative size-full"
                    style={
                      settled
                        ? { opacity: 1, transform: "none" }
                        : {
                            opacity: inView ? 1 : 0,
                            transform: inView ? "scale(1)" : "scale(0.4)",
                            transition: t(
                              `opacity 600ms ease-out ${700 + i * 130}ms, transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1) ${700 + i * 130}ms`
                            ),
                          }
                    }
                  >
                    <button
                      type="button"
                      onMouseEnter={() => hoverActivate(label)}
                      onMouseMove={() => hoverActivate(label)}
                      onFocus={() => setActive(label)}
                      onClick={() => setActive(label)}
                      aria-label={label}
                      className={`flex h-full w-full items-center justify-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-[#e00000] bg-[#b80100] shadow-[0_0_1.5rem_rgba(224,0,0,0.55)]"
                          : "border-[#3a3a3a] bg-[#242424]"
                      }`}
                    >
                      <Image src={icon} alt="" width={32} height={32} className="h-[56%] w-[56%]" />
                    </button>

                    <span
                     className={`${spaceGrotesk.className} pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.8125rem] transition-colors duration-300 sm:text-[0.9375rem] lg:text-sm xl:text-[1.125rem] ${
                        labelAbove ? "bottom-full mb-1.5" : "top-full mt-1.5"
                      } ${isActive ? "text-white" : "text-[#a5a5a5]"}`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- Right: text ---------- */}
        <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-6 sm:gap-[1.875rem] lg:basis-0">
          <h2 className="font-oxanium text-[clamp(1.625rem,7.4vw,2.25rem)] font-bold leading-tight sm:text-4xl md:text-[3.125rem] md:leading-[3.75rem]">
            Independent Expertise.
            <br />
            <span className="text-[#b80100]">Shared Global Strength.</span>
          </h2>

          <p className="font-poppins text-base text-[#b2b2b2] lg:text-[1.125rem]">
            Every Way Wise company focuses on its own industry while benefiting from shared
            leadership, technology, market access and operational support.
          </p>

          <ul className="flex w-full max-w-[35.1875rem] flex-col gap-2.5 md:max-w-none">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex min-h-14 items-center gap-3 rounded-md border border-[#2e2e2e] bg-black/20 px-[1.0625rem] backdrop-blur-[0.1875rem]"
              >
                <CheckCircleIcon />
                <span className={`${inter.className} text-[max(0.875rem,13px)] leading-[calc(1.25/0.875)] text-[#b2b2b2]`}>{item}</span>
              </li>
            ))}
          </ul>

          <PartnerWithUsLink
            href="#contact"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#b80100] px-[1.875rem] font-oxanium text-base font-bold capitalize text-white hover:bg-[#9a0100] sm:h-14 sm:w-auto sm:text-lg xl:text-xl"
          >
            Partner with us
          </PartnerWithUsLink>
        </div>
      </div>
    </section>
  );
}
