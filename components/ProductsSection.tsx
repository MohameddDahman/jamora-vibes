// components/ProductsSection.tsx
"use client";

import { useState } from "react";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { Doc } from "@/convex/_generated/dataModel";

type Category = Doc<"products">["category"];

export function ProductsSection() {
  const [category, setCategory] = useState<Category | undefined>(undefined);

  return (
    <div className="mt-10">
      <CategoryFilters active={category} onSelect={setCategory} />
      <div className="mt-8">
        <ProductGrid category={category} />
      </div>
    </div>
  );
}
