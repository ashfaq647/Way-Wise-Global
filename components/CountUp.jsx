"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function CountUp({
  to,
  from = 0,
  digits = 0,
  mode = "roll",
  easing = "easeOut",
  duration = 2,
  delay = 0,
  trigger = "view",
  startWhen = true,
  prefix = "",
  suffix = "",
  separator = "",
  className = "",
  style,
  onStart,
  onEnd,
}) {
  const ref = useRef(null);
  const stripRefs = useRef([]);
  const isInView = useInView(ref, { once: true });
  const [started, setStarted] = useState(false);

  const target = Math.max(0, Math.trunc(Number(to) || 0));
  const initial = Math.max(0, Math.trunc(Number(from) || 0));

  const width = Math.max(
    String(target).length,
    String(initial).length,
    Number(digits) || 0,
  );

  const targetDigits = String(target).padStart(width, "0");
  const initialDigits = String(initial).padStart(width, "0");

  const active = trigger === "load" || isInView;

  const easeMap = {
    linear: "linear",
    easeOut: [0.33, 1, 0.68, 1],
    expo: [0.16, 1, 0.3, 1],
    spring: [0.22, 1.2, 0.36, 1],
  };

  useEffect(() => {
    if (!active || !startWhen || started) return;

    const timer = setTimeout(() => {
      setStarted(true);
      onStart?.();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [active, startWhen, started, delay, onStart]);

  useEffect(() => {
    if (!started) return;

    const strips = stripRefs.current.filter(Boolean);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      strips.forEach((strip) => {
        strip.style.transform = strip.dataset.targetTransform;
      });

      onEnd?.();
      return;
    }

    const controls = strips.map((strip, index) => {
      const startOffset = Number(strip.dataset.startOffset);
      const targetOffset = Number(strip.dataset.targetOffset);

      return animate(startOffset, targetOffset, {
        duration,
        delay: index * Math.min(0.06, duration * 0.08),
        ease: easeMap[easing] || easeMap.easeOut,
        onUpdate: (position) => {
          strip.style.transform = `translateY(-${position * 1.2}em)`;
        },
      });
    });

    const stagger =
      Math.max(0, strips.length - 1) * Math.min(0.06, duration * 0.08);

    const timer = setTimeout(
      () => {
        onEnd?.();
      },
      (duration + stagger) * 1000 + 50,
    );

    return () => {
      controls.forEach((control) => control.stop());
      clearTimeout(timer);
    };
  }, [started, duration, easing, onEnd]);

  const renderNumber = () => {
    if (mode !== "roll") {
      return `${prefix}${target.toLocaleString("en-US")}${suffix}`;
    }

    const parts = [];

    targetDigits.split("").forEach((digit, index) => {
      const place = 10 ** (width - index - 1);
      const targetOffset = Math.floor(target / place);
      const startOffset = Math.floor(initial / place);

      // Enough digits for every rolling position, including 000 -> 100.
      const totalRows = Math.max(targetOffset, startOffset) + 1;

      parts.push(
        <span
          key={`digit-${index}`}
          className="inline-block overflow-hidden align-bottom"
          style={{
            height: "1.2em",
            lineHeight: "1.2em",
          }}
        >
          <span
            ref={(node) => {
              stripRefs.current[index] = node;
            }}
            data-start-offset={startOffset}
            data-target-offset={targetOffset}
            data-target-transform={`translateY(-${targetOffset * 1.2}em)`}
            className="flex flex-col"
            style={{
              transform: `translateY(-${(started ? startOffset : 0) * 1.2}em)`,
              willChange: "transform",
            }}
          >
            {Array.from({ length: totalRows }, (_, row) => (
              <span
                key={row}
                className="block"
                style={{
                  height: "1.2em",
                  lineHeight: "1.2em",
                }}
              >
                {row % 10}
              </span>
            ))}
          </span>
        </span>,
      );

      const remainingDigits = width - index - 1;

      if (separator && remainingDigits > 0 && remainingDigits % 3 === 0) {
        parts.push(<span key={`separator-${index}`}>{separator}</span>);
      }
    });

    return (
      <>
        {prefix && <span>{prefix}</span>}
        {parts}
        {suffix && <span>{suffix}</span>}
      </>
    );
  };

  return (
    <span
      ref={ref}
      className={`inline-flex items-center whitespace-nowrap ${className}`}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
    >
      <span className="sr-only">
        {prefix}
        {target.toLocaleString("en-US")}
        {suffix}
      </span>

      <span aria-hidden="true" className="inline-flex items-center">
        {renderNumber()}
      </span>
    </span>
  );
}
