// components/story/LinerNote.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * The single quote on the page, set like a liner note on a sleeve. The rule
 * above it draws itself as you arrive — the only motion here, because the
 * sentence should be doing the work.
 */
export function LinerNote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });
  const rule = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="bg-ink px-4 py-28 sm:px-6 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-3xl">
        <div className="relative h-px w-full bg-ivory/10">
          <motion.div style={{ width: rule }} className="absolute inset-y-0 left-0 bg-brass" />
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <p className="display-md text-[clamp(1.4rem,3vw,2.35rem)] text-ivory">
            An instrument isn&apos;t a spec sheet. It&apos;s wood and wire that has to feel
            right the moment you pick it up, and sound right the moment you stop trying.
          </p>
          <footer className="mt-8 flex items-center gap-3">
            <span className="h-px w-8 bg-brass" />
            <span className="label text-[0.6rem] text-ivory/45">Founder, Jamora Vibes</span>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
