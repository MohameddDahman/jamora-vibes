// app/admin/products/[id]/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = useQuery(api.products.getById, { id: id as Id<"products"> });

  return (
    <div>
      <Link
        href="/admin/products"
        className="flex items-center gap-1.5 font-sans text-xs font-medium text-ink/50 transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to Products
      </Link>

      {product === undefined && <p className="mt-8 font-sans text-sm text-ink/40">Loading…</p>}

      {product === null && (
        <p className="mt-8 font-sans text-sm text-ink/40">This product couldn&apos;t be found.</p>
      )}

      {product && (
        <>
          <h1 className="mt-4 font-sans text-2xl font-semibold text-ink">{product.name}</h1>
          <div className="mt-8">
            <ProductForm product={product} />
          </div>
        </>
      )}
    </div>
  );
}
