"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const STATS = [
  { value: 340, suffix: "+", label: "Instruments Placed" },
  { value: 9, suffix: "", label: "Years Curating" },
  { value: 27, suffix: "", label: "Governorates Delivered To" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1600, bounce: 0 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toString();
    });
  }, [springValue]);

  return (
    <span className="display-lg text-5xl text-ink">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function StoryStats() {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="text-center"
        >
          <Counter value={stat.value} suffix={stat.suffix} />
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.12em] text-ink/50">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}