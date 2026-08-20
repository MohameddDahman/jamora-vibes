// app/(storefront)/products/[id]/page.tsx
"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, Volume2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RelatedProducts } from "@/components/RelatedProducts";
import { HearIt } from "@/components/HearIt";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/families";
import { notifyAddedToCart } from "@/lib/cartToast";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = useQuery(api.products.getById, { id: id as Id<"products"> });
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="aspect-square animate-pulse bg-stage" />
          <div className="space-y-4 pt-8">
            <div className="h-3 w-24 animate-pulse bg-stage" />
            <div className="h-10 w-3/4 animate-pulse bg-stage" />
            <div className="h-6 w-32 animate-pulse bg-stage" />
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="display-md text-2xl text-ink">We couldn&apos;t find that instrument</h1>
        <p className="mt-3 font-sans text-sm text-graphite">
          It may have sold. Browse what&apos;s in stock now.
        </p>
        <Link
          href="/instruments"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
        >
          Browse instruments
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    notifyAddedToCart({ name: product.name, image: product.image, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const soldOut = product.stock === 0;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-sans text-xs text-graphite">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/instruments" className="hover:text-ink">
          Instruments
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink">{categoryLabel}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden bg-stage">
          {product.badge && (
            <span className="label absolute left-4 top-4 z-10 bg-ink px-3 py-1.5 text-[0.6rem] tracking-[0.1em] text-ivory">
              {product.badge}
            </span>
          )}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-8 sm:p-12"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-sans text-xs text-graphite">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center py-2">
          <p className="label text-graphite">
            {product.brand}
            {product.condition === "used" && " · Pre-owned"}
          </p>

          <h1 className="display-lg mt-3 text-[clamp(1.75rem,4vw,3rem)] text-ink">
            {product.name}
          </h1>

          <p className="mt-5 font-mono text-2xl text-ink">
            {formatPrice(product.price)}
            <span className="ml-1.5 text-base text-graphite">L.E</span>
          </p>

          <p className="mt-6 max-w-md font-sans text-[0.95rem] leading-relaxed text-graphite">
            {product.description ||
              "Sourced, inspected and set up in our workshop before it ships."}
          </p>

          <p className="mt-6 flex items-center gap-2 font-sans text-sm text-graphite">
            <span
              className={`h-1.5 w-1.5 rounded-full ${soldOut ? "bg-oxblood" : "bg-sage"}`}
            />
            {soldOut ? "Out of stock" : `${product.stock} in stock — ships in 2–4 days`}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={soldOut}
              className="w-full rounded-full bg-ink py-4 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {soldOut ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
            </button>

            {product.sound && (
              <HearIt soundUrl={product.sound} variant="outline" label="Hear this instrument" />
            )}
          </div>

          {product.sound && (
            <p className="mt-3 flex items-start gap-2 font-sans text-xs leading-relaxed text-graphite">
              <Volume2 size={13} className="mt-0.5 shrink-0 text-brass" />
              This is a recording of this exact instrument, not a stock sample of the model.
            </p>
          )}

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-3">
            <div>
              <dt className="label text-[0.6rem] text-graphite">Family</dt>
              <dd className="mt-1 font-sans text-sm text-ink">{categoryLabel}</dd>
            </div>
            <div>
              <dt className="label text-[0.6rem] text-graphite">Condition</dt>
              <dd className="mt-1 font-sans text-sm capitalize text-ink">{product.condition}</dd>
            </div>
            <div>
              <dt className="label text-[0.6rem] text-graphite">Brand</dt>
              <dd className="mt-1 font-sans text-sm text-ink">{product.brand}</dd>
            </div>
          </dl>

          <div className="mt-7 space-y-2.5 border-t border-line pt-6">
            <p className="flex items-center gap-2.5 font-sans text-sm text-graphite">
              <Truck size={15} strokeWidth={1.6} className="shrink-0 text-ink" />
              Cash on delivery, anywhere in Egypt
            </p>
            <p className="flex items-center gap-2.5 font-sans text-sm text-graphite">
              <ShieldCheck size={15} strokeWidth={1.6} className="shrink-0 text-ink" />
              Inspected and set up before dispatch
            </p>
          </div>
        </div>
      </div>

      <RelatedProducts excludeIds={[product._id]} limit={4} title="More from the collection" />
    </div>
  );
}
