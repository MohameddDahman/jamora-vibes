// components/HeroSlideshow.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/families";
import { HearIt } from "@/components/HearIt";

const AUTOPLAY_MS = 7000;

export function HeroSlideshow() {
  const data = useQuery(api.products.list, {
    paginationOpts: { numItems: 5, cursor: null },
  });

  const [index, setIndex] = useState(0);
  const slides = data?.page ?? [];

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length, index]);

  if (data === undefined) {
    return <div className="h-[78vh] min-h-[520px] w-full animate-pulse bg-stage" />;
  }

  if (slides.length === 0) {
    return (
      <div className="flex h-[78vh] min-h-[520px] w-full flex-col items-center justify-center bg-ink text-center">
        <p className="label text-brass">Jamora Vibes</p>
        <h1 className="display-xl mt-4 text-5xl text-ivory">Hear it first</h1>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-ink">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.image ? (
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-walnut" />
          )}
          {/* Scrim weighted to the bottom-left, where the copy sits. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="label text-brass">
              Featured — {CATEGORY_LABELS[slide.category] ?? slide.category}
            </p>

            <h1 className="display-xl mt-4 text-[clamp(2.25rem,6vw,4.5rem)] text-ivory">
              {slide.name}
            </h1>

            {slide.description && (
              <p className="mt-5 max-w-lg font-sans text-[0.95rem] leading-relaxed text-ivory/65">
                {slide.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${slide._id}`}
                className="rounded-full bg-ivory px-7 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                Shop now
              </Link>

              {slide.sound ? (
                <HearIt soundUrl={slide.sound} variant="solid" />
              ) : (
                <Link
                  href="/instruments"
                  className="rounded-full border border-ivory/35 px-7 py-3 font-sans text-sm font-semibold text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
                >
                  Browse families
                </Link>
              )}

              <span className="ml-1 font-mono text-sm text-ivory/70">
                {formatPrice(slide.price)} L.E
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide selector, bottom-right — Gibson's thumbnail rail. */}
        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-2 sm:absolute sm:bottom-16 sm:right-6 sm:mt-0 lg:right-10">
            {slides.map((s, i) => {
              const isActive = i === index;
              return (
                <button
                  key={s._id}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.name}`}
                  aria-current={isActive}
                  className={`relative h-1 w-10 overflow-hidden transition-colors sm:h-14 sm:w-14 ${
                    isActive
                      ? "bg-ivory sm:bg-transparent sm:ring-2 sm:ring-ivory"
                      : "bg-ivory/30 sm:bg-transparent sm:opacity-45 sm:ring-1 sm:ring-ivory/30 sm:hover:opacity-75"
                  }`}
                >
                  {s.image && (
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="hidden object-cover sm:block"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
