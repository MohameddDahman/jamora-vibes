// components/FamilyCatalog.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Doc } from "@/convex/_generated/dataModel";
import { FAMILIES, type FamilyCategory } from "@/lib/families";

type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

/**
 * One catalog layout shared by all six family routes. Each route is a thin
 * wrapper that names its category, so the pages can't drift apart visually.
 */
export function FamilyCatalog({ category }: { category: FamilyCategory }) {
  const family = FAMILIES.find((f) => f.category === category);
  const { results, status, loadMore } = usePaginatedQuery(
    api.products.list,
    { category: category as Doc<"products">["category"] },
    { initialNumItems: 8 }
  );
  const [sort, setSort] = useState<SortOption>("newest");

  const sorted = useMemo(() => {
    if (sort === "price-asc") return [...results].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...results].sort((a, b) => b.price - a.price);
    return results;
  }, [results, sort]);

  const isLoading = status === "LoadingFirstPage";

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
        <span className="text-ink">{family?.label ?? category}</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="display-lg text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
          {family?.label ?? category}
        </h1>
        {family && (
          <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-graphite">
            {family.blurb}
          </p>
        )}
      </header>

      <div className="mt-10 flex items-center justify-between gap-4 border-b border-line pb-4">
        <p className="font-mono text-xs text-graphite">
          {isLoading ? "…" : `${results.length} ${results.length === 1 ? "result" : "results"}`}
        </p>
        <label className="flex items-center gap-2">
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="cursor-pointer border-0 bg-transparent font-sans text-sm font-semibold text-ink focus:outline-none"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square animate-pulse bg-stage" />
              <div className="mt-4 h-3 w-16 animate-pulse bg-stage" />
              <div className="mt-2 h-4 w-3/4 animate-pulse bg-stage" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-sans text-sm text-graphite">
            Nothing in this family right now.
          </p>
          <Link
            href="/instruments"
            className="mt-6 inline-block rounded-full border border-ink px-7 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            Browse other families
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {status === "CanLoadMore" && (
            <div className="mt-14 flex justify-center">
              <button
                onClick={() => loadMore(8)}
                className="rounded-full border border-ink px-8 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
