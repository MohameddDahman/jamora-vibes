// components/SearchOverlay.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/families";
import { Search, X, Volume2, ArrowRight } from "lucide-react";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTerm("");
      setDebounced("");
      const id = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 200);
    return () => clearTimeout(id);
  }, [term]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useQuery(api.products.search, debounced ? { term: debounced, limit: 6 } : "skip");

  const goToResults = () => {
    if (!term.trim()) return;
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50"
      />

      <div className="relative bg-paper shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-3xl px-4 pt-5 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToResults();
            }}
            className="flex items-center gap-3 border-b border-line pb-4"
          >
            <Search size={20} strokeWidth={1.75} className="shrink-0 text-graphite" />
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="What can we help you find?"
              className="w-full bg-transparent font-display text-xl font-bold tracking-tight text-ink placeholder:font-normal placeholder:tracking-normal placeholder:text-graphite/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="shrink-0 text-graphite transition-colors hover:text-ink"
            >
              <X size={20} />
            </button>
          </form>

          <div className="max-h-[62vh] overflow-y-auto pb-6">
            {!debounced && (
              <p className="py-12 text-center font-sans text-sm text-graphite">
                Search by instrument, brand, or family.
              </p>
            )}

            {debounced && results === undefined && (
              <p className="py-12 text-center font-sans text-sm text-graphite">Searching…</p>
            )}

            {debounced && results?.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-sans text-sm text-ink">Nothing matches “{debounced}”</p>
                <Link
                  href="/instruments"
                  onClick={onClose}
                  className="mt-4 inline-block font-sans text-sm font-semibold text-brass hover:underline"
                >
                  Browse all instruments
                </Link>
              </div>
            )}

            {results && results.length > 0 && (
              <ul className="divide-y divide-line">
                {results.map((product) => (
                  <li key={product._id}>
                    <Link
                      href={`/products/${product._id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 transition-colors hover:bg-stage"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-stage">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-contain p-1.5"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="label text-[0.6rem] text-graphite">
                            {CATEGORY_LABELS[product.category] ?? product.category}
                          </span>
                          {product.sound && (
                            <Volume2 size={11} strokeWidth={2.25} className="text-brass" />
                          )}
                        </div>
                        <p className="truncate font-display text-sm font-bold tracking-tight text-ink">
                          {product.name}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-sm text-graphite">
                        {formatPrice(product.price)} L.E
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {debounced && results && results.length > 0 && (
              <button
                onClick={goToResults}
                className="group mt-3 flex w-full items-center justify-center gap-1.5 border-t border-line py-4 font-sans text-sm font-semibold text-ink"
              >
                See all results
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
