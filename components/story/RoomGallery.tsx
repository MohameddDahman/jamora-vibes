// components/story/RoomGallery.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const SHOTS = [
  {
    src: "https://images.unsplash.com/photo-1559304754-0ef88b668021?w=1200",
    caption: "Spruce top, before the finish goes on",
    depth: -14,
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1504148591118-0a532fa91a01?w=1200",
    caption: "Bridge and f-holes, cello in for setup",
    depth: 10,
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1598090854937-9fc55eaebdf6?w=1200",
    caption: "Finished and waiting on its take",
    depth: -8,
    tall: true,
  },
];

/**
 * Three plates drifting at different rates. Restrained on purpose — the
 * captions do the work, and the transport bar is still the loud element.
 */
export function RoomGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section className="bg-ink px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <p className="label text-brass">The room</p>
        <h2 className="display-lg mt-3 max-w-2xl text-[clamp(1.85rem,4vw,3.25rem)] text-ivory">
          Nothing here is a stock photo
        </h2>
        <p className="mt-5 max-w-lg font-sans text-[0.95rem] leading-relaxed text-ivory/55">
          These are instruments that came through the bench. If you order one of them,
          it&apos;s the one you get.
        </p>

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {SHOTS.map((shot) => (
            <Plate key={shot.src} shot={shot} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Plate({
  shot,
  progress,
}: {
  shot: (typeof SHOTS)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], ["0%", `${shot.depth}%`]);

  return (
    <motion.figure style={{ y }} className={shot.tall ? "" : "sm:mt-16"}>
      <div
        className={`relative overflow-hidden ${
          shot.tall ? "aspect-[3/4]" : "aspect-square"
        }`}
      >
        <Image
          src={shot.src}
          alt=""
          fill
          sizes="(min-width: 640px) 31vw, 92vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-3 font-sans text-xs text-ivory/45">
        {shot.caption}
      </figcaption>
    </motion.figure>
  );
}
