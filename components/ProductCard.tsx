// components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/families";
import { HearIt } from "@/components/HearIt";

export function ProductCard({ product }: { product: Doc<"products"> }) {
  return (
    <div className="group">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stage">
          {/* Status labels, stacked top-left like a spec sticker */}
          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {product.badge && (
              <span className="label bg-ink px-2.5 py-1 text-[0.6rem] tracking-[0.1em] text-ivory">
                {product.badge}
              </span>
            )}
            {product.condition === "used" && (
              <span className="label bg-paper px-2.5 py-1 text-[0.6rem] tracking-[0.1em] text-graphite">
                Pre-Owned
              </span>
            )}
            {product.stock === 0 && (
              <span className="label bg-oxblood px-2.5 py-1 text-[0.6rem] tracking-[0.1em] text-ivory">
                Sold Out
              </span>
            )}
          </div>

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:p-8"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-sans text-xs text-graphite">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label text-[0.6rem] text-graphite">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </p>
            <Link href={`/products/${product._id}`}>
              <h3 className="mt-1.5 font-display text-[0.95rem] font-bold leading-snug tracking-tight text-ink">
                {product.name}
              </h3>
            </Link>
            <p className="mt-0.5 font-sans text-[0.8rem] text-graphite">{product.brand}</p>
          </div>

          {/* The signature: audition the instrument without leaving the grid. */}
          {product.sound && (
            <div className="shrink-0 pt-4">
              <HearIt soundUrl={product.sound} variant="icon" />
            </div>
          )}
        </div>

        <p className="mt-2.5 font-mono text-sm text-ink">{formatPrice(product.price)} L.E</p>
      </div>
    </div>
  );
}
