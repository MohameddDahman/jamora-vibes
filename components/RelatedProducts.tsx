// components/RelatedProducts.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProductCard } from "@/components/ProductCard";

export function RelatedProducts({
  excludeIds = [],
  limit = 4,
  eyebrow,
  title = "More from the collection",
}: {
  excludeIds?: Id<"products">[];
  limit?: number;
  eyebrow?: string;
  title?: string;
}) {
  const data = useQuery(api.products.list, {
    paginationOpts: { numItems: limit + excludeIds.length, cursor: null },
  });

  if (data === undefined) return null;

  const products = data.page.filter((p) => !excludeIds.includes(p._id)).slice(0, limit);
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-line pt-12 lg:mt-24">
      {eyebrow && <p className="label text-graphite">{eyebrow}</p>}
      <h2 className="display-md mt-1.5 text-[clamp(1.35rem,2.5vw,1.85rem)] text-ink">{title}</h2>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
