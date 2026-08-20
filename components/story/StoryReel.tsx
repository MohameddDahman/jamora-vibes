// components/story/StoryReel.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ReelChapter = {
  timecode: string;
  label: string;
  heading: string;
  body: string;
  image: string;
  credit: string;
};

/**
 * The story is pinned and travels sideways as you scroll — tape moving past
 * the playhead in the transport bar below. One mechanism carries the whole
 * page rather than a different effect per section.
 */
export function StoryReel({ id, chapters }: { id: string; chapters: ReelChapter[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      // Respect the user's motion preference: no pinning, no scrub — the
      // chapters simply stack and read as a normal vertical page.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      const travel = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each panel lifts as it crosses the centre of the viewport, driven by
      // horizontal position rather than page scroll.
      gsap.utils.toArray<HTMLElement>("[data-panel]", track).forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-panel-inner]"),
          { yPercent: 8, opacity: 0.25 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: travel,
              start: "left 85%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative overflow-hidden bg-ink text-ivory"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-6 px-4 py-20 sm:gap-10 sm:px-6 lg:px-10 motion-reduce:w-full motion-reduce:flex-col motion-reduce:items-stretch motion-reduce:gap-20"
      >
        {chapters.map((chapter) => (
          <article
            key={chapter.timecode}
            data-panel
            className="w-[86vw] shrink-0 sm:w-[70vw] lg:w-[62vw] motion-reduce:w-full"
          >
            <div
              data-panel-inner
              className="grid items-center gap-8 sm:grid-cols-[1.05fr_1fr] sm:gap-12"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                <Image
                  src={chapter.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 34vw, 84vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="label absolute bottom-4 left-4 text-[0.6rem] text-ivory/60">
                  {chapter.credit}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-brass">{chapter.timecode}</span>
                  <span className="label text-[0.6rem] text-ivory/40">{chapter.label}</span>
                </div>

                <h2 className="display-lg mt-5 text-[clamp(1.75rem,3.4vw,3rem)] text-ivory">
                  {chapter.heading}
                </h2>

                <p className="mt-5 max-w-md font-sans text-[0.95rem] leading-relaxed text-ivory/60">
                  {chapter.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
