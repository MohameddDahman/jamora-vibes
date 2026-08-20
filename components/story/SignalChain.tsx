// components/story/SignalChain.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const STAGES = [
  {
    stage: "Source",
    body: "A maker or workshop we already buy from. Relationships first, catalogues never.",
  },
  {
    stage: "Bench",
    body: "Relief, action, intonation, frets, tuning stability. Adjusted until it plays right.",
  },
  {
    stage: "Mic",
    body: "One microphone, one room, one take. No edits, no sweetening, no other instrument.",
  },
  {
    stage: "Listing",
    body: "The take is attached to that serial number. Nothing goes live without it.",
  },
  {
    stage: "Your door",
    body: "Packed, delivered, and paid for in cash once it's in your hands.",
  },
];

function Node({
  index,
  total,
  progress,
  stage,
  body,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  stage: string;
  body: string;
}) {
  const point = index / (total - 1);
  const opacity = useTransform(
    progress,
    [Math.max(0, point - 0.16), point],
    [0.2, 1]
  );
  const y = useTransform(progress, [Math.max(0, point - 0.16), point], [18, 0]);
  const dotScale = useTransform(
    progress,
    [Math.max(0, point - 0.06), point, Math.min(1, point + 0.06)],
    [1, 1.9, 1]
  );
  const dotFill = useTransform(
    progress,
    [Math.max(0, point - 0.06), point],
    ["#0E0E0F", "#B8874A"]
  );

  return (
    <motion.li style={{ opacity, y }} className="relative flex-1 pt-12">
      <motion.span
        aria-hidden
        style={{ scale: dotScale, backgroundColor: dotFill }}
        className="absolute left-0 top-[26px] block h-3 w-3 -translate-y-1/2 rounded-full ring-2 ring-brass"
      />
      <p className="font-mono text-xs text-brass">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="display-md mt-2 text-lg text-ivory">{stage}</h3>
      <p className="mt-2 max-w-[26ch] font-sans text-sm leading-relaxed text-ivory/55">
        {body}
      </p>
    </motion.li>
  );
}

/**
 * The one place a numbered sequence is honest: this really is an ordered
 * process, and the connecting line is drawn by scroll so the reader is
 * literally following the signal from the maker to their door.
 */
export function SignalChain() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="bg-ink px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <p className="label text-brass">The signal chain</p>
        <h2 className="display-lg mt-3 max-w-2xl text-[clamp(1.85rem,4vw,3.25rem)] text-ivory">
          Five stages between a maker and your hands
        </h2>

        <div ref={ref} className="relative mt-16">
          {/* Horizontal rail on wide screens */}
          <div className="absolute left-0 top-[26px] hidden h-px w-full bg-ivory/12 sm:block" />
          <motion.div
            style={{ width: lineWidth }}
            className="absolute left-0 top-[26px] hidden h-px bg-brass sm:block"
          />
          {/* Vertical rail on narrow screens */}
          <div className="absolute left-[5px] top-0 h-full w-px bg-ivory/12 sm:hidden" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[5px] top-0 w-px bg-brass sm:hidden"
          />

          <ol className="flex flex-col gap-10 pl-8 sm:flex-row sm:gap-8 sm:pl-0">
            {STAGES.map((s, i) => (
              <Node
                key={s.stage}
                index={i}
                total={STAGES.length}
                progress={scrollYProgress}
                stage={s.stage}
                body={s.body}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
