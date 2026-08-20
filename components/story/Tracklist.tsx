// components/story/Tracklist.tsx
"use client";

import { motion } from "framer-motion";

const TRACKS = [
  {
    year: "2016",
    title: "One bench, one city",
    body: "Started as a repair bench in Cairo, restoring string instruments for players who couldn't find anyone else to do it.",
  },
  {
    year: "2019",
    title: "Sourcing directly",
    body: "Stopped buying from distributors and started buying from the workshops themselves, in Europe and Egypt.",
  },
  {
    year: "2022",
    title: "The recording rule",
    body: "Every listing gets a take of the actual instrument. It slowed us down and it doubled what people trusted us with.",
  },
  {
    year: "Today",
    title: "Six families, nationwide",
    body: "Guitars, pianos, violins, brass, drums and the parts that keep them playing — delivered anywhere in Egypt, paid on arrival.",
  },
];

/**
 * A year list is a genuine sequence, so it's presented as a tracklist: the
 * year does the ordering work, no invented 01/02/03 on top of it.
 */
export function Tracklist() {
  return (
    <section className="bg-ink px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <p className="label text-brass">Tracklist</p>
        <h2 className="display-lg mt-3 max-w-2xl text-[clamp(1.85rem,4vw,3.25rem)] text-ivory">
          How the room got here
        </h2>

        <ol className="mt-14 border-t border-ivory/10">
          {TRACKS.map((track, i) => (
            <motion.li
              key={track.year}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-3 border-b border-ivory/10 py-8 sm:grid-cols-[7rem_1fr_1.1fr] sm:items-baseline sm:gap-8 lg:py-10"
            >
              <span className="font-mono text-sm text-brass">{track.year}</span>
              <h3 className="display-md text-xl text-ivory transition-transform duration-500 group-hover:translate-x-1 sm:text-2xl">
                {track.title}
              </h3>
              <p className="max-w-md font-sans text-sm leading-relaxed text-ivory/55">
                {track.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
