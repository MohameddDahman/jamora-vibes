// app/(storefront)/search/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { Search } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const [term, setTerm] = useState(query);

  useEffect(() => {
    setTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

  const results = useQuery(api.products.search, query ? { term: query, limit: 24 } : "skip");

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(term.trim() ? `/search?q=${encodeURIComponent(term.trim())}` : "/search");
        }}
        className="flex max-w-xl items-center gap-3 border-b border-line pb-4"
      >
        <Search size={20} strokeWidth={1.75} className="shrink-0 text-graphite" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="What can we help you find?"
          className="w-full bg-transparent font-display text-xl font-bold tracking-tight text-ink placeholder:font-normal placeholder:tracking-normal placeholder:text-graphite/60 focus:outline-none"
        />
      </form>

      {query && (
        <p className="mt-6 font-mono text-xs text-graphite">
          {results === undefined
            ? "Searching…"
            : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`}
        </p>
      )}

      <div className="mt-8">
        {!query && (
          <p className="py-20 text-center font-sans text-sm text-graphite">
            Search by instrument, brand, or family.
          </p>
        )}

        {query && results?.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-sans text-sm text-ink">Nothing matches “{query}”</p>
            <Link
              href="/instruments"
              className="mt-6 inline-block rounded-full border border-ink px-7 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              Browse all instruments
            </Link>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-sans text-sm text-graphite">Loading…</div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
