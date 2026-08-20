// app/admin/products/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
  const products = useQuery(api.products.list, { paginationOpts: { numItems: 500, cursor: null } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-ink">Products</h1>
          <p className="mt-1 font-sans text-sm text-ink/50">
            {products ? `${products.page.length} total` : "Loading…"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 bg-ink px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.1em] text-ivory transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          New Product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10 font-sans text-xs uppercase tracking-[0.08em] text-ink/40">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products?.page.map((product) => (
              <tr key={product._id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-10 shrink-0 overflow-hidden bg-ink/[0.04]">
                      {product.image && (
                        <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-medium text-ink">{product.name}</p>
                      <p className="font-sans text-xs text-ink/40">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-sans text-sm capitalize text-ink/60">{product.category}</td>
                <td className="px-4 py-3 font-mono text-sm text-ink">{formatPrice(product.price)} L.E</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono text-sm ${product.stock === 0 ? "text-oxblood" : "text-ink/70"}`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-brass hover:opacity-70"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {products && products.page.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-sans text-sm text-ink/40">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-brass hover:opacity-70">
                    Create the first one
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
