// app/admin/products/new/page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="flex items-center gap-1.5 font-sans text-xs font-medium text-ink/50 transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to Products
      </Link>

      <h1 className="mt-4 font-sans text-2xl font-semibold text-ink">New Product</h1>

      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
