// components/ProductGrid.tsx
"use client";

import { useMemo, useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { Doc } from "@/convex/_generated/dataModel";

type Category = Doc<"products">["category"];
type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export function ProductGrid({ category }: { category?: Category }) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.products.list,
    { category },
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
    <div>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
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
        <p className="py-20 text-center font-sans text-sm text-graphite">
          Nothing in this family yet. Check another, or browse everything.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {sorted.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

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
    </div>
  );
}
