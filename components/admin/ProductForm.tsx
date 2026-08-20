// components/admin/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { formatPrice } from "@/lib/format";
import { Trash2 } from "lucide-react";

const CATEGORIES: { value: Doc<"products">["category"]; label: string }[] = [
  { value: "guitars", label: "Guitars" },
  { value: "keyboards", label: "Keyboards / Pianos" },
  { value: "drums", label: "Drums" },
  { value: "brass", label: "Brass" },
  { value: "violins", label: "Violins" },
  { value: "woodwinds", label: "Woodwinds" },
  { value: "accessories", label: "Accessories" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs font-medium uppercase tracking-[0.08em] text-ink/50">
        {label}
      </label>
      <div className="mt-2 border border-ink/15 bg-white px-3.5 py-2.5 transition-colors focus-within:border-brass">
        {children}
      </div>
    </div>
  );
}

const inputClass = "w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink/30 focus:outline-none";

export function ProductForm({ product }: { product?: Doc<"products"> }) {
  const router = useRouter();
  const isEdit = !!product;

  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState<Doc<"products">["category"]>(product?.category ?? "guitars");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [condition, setCondition] = useState<"new" | "used">(product?.condition ?? "new");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [badge, setBadge] = useState<string>(product?.badge ?? "");

  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [soundStorageId, setSoundStorageId] = useState<Id<"_storage"> | null>(null);
  const [soundRemoved, setSoundRemoved] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !imageStorageId) {
      setError("Please upload a product image before saving.");
      return;
    }
    if (!name.trim() || !brand.trim() || !price || !stock) {
      setError("Please fill in name, brand, price, and stock.");
      return;
    }

    setSubmitting(true);
    try {
      const base = {
        name: name.trim(),
        description: description.trim(),
        category,
        brand: brand.trim(),
        price: Number(price),
        condition,
        stock: Number(stock),
        badge: badge ? (badge as "Limited Edition" | "Pre-Order") : undefined,
      };

      if (isEdit) {
        await updateProduct({
          id: product._id,
          ...base,
          ...(imageStorageId ? { imageStorageId } : {}),
          ...(soundRemoved ? { sound: "" } : soundStorageId ? { soundStorageId } : {}),
        });
      } else {
        await createProduct({
          ...base,
          imageStorageId: imageStorageId!,
          ...(soundStorageId ? { soundStorageId } : {}),
        });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await deleteProduct({ id: product._id });
    router.push("/admin/products");
    router.refresh();
  };

  const displayImage = previewImageUrl ?? product?.image;

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
      <div className="min-w-0">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Product Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yamaha FG820-12 Twelve-String"
              required
              className={inputClass}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short, sensory description of the instrument."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Doc<"products">["category"])}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Brand">
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Yamaha"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Price (L.E)">
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Stock">
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Condition">
          <select value={condition} onChange={(e) => setCondition(e.target.value as "new" | "used")} className={inputClass}>
            <option value="new">New</option>
            <option value="used">Used / Pre-Owned</option>
          </select>
        </Field>

        <Field label="Badge (optional)">
          <select value={badge} onChange={(e) => setBadge(e.target.value)} className={inputClass}>
            <option value="">None</option>
            <option value="Limited Edition">Limited Edition</option>
            <option value="Pre-Order">Pre-Order</option>
          </select>
        </Field>

        <div className="sm:col-span-2">
          <FileUploadField
            label="Product Image"
            kind="image"
            required={!isEdit}
            currentUrl={product?.image}
            onUploaded={setImageStorageId}
            onPreviewUrl={setPreviewImageUrl}
          />
        </div>

        <div className="sm:col-span-2">
          <FileUploadField
            label="Sound Sample (optional)"
            kind="audio"
            currentUrl={soundRemoved ? undefined : product?.sound}
            onUploaded={(id) => {
              setSoundStorageId(id);
              setSoundRemoved(false);
            }}
            onClear={
              product?.sound
                ? () => {
                    setSoundStorageId(null);
                    setSoundRemoved(true);
                  }
                : undefined
            }
          />
        </div>
      </div>

      {error && <p className="mt-5 font-sans text-sm text-oxblood">{error}</p>}

      <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-ink px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.12em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="font-sans text-xs uppercase tracking-[0.1em] text-ink/50 hover:text-ink"
          >
            Cancel
          </button>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.1em] text-oxblood/70 transition-colors hover:text-oxblood"
          >
            <Trash2 size={14} />
            Delete Product
          </button>
        )}
      </div>
      </div>

      {/* Live preview — approximates the storefront product card */}
      <div className="lg:sticky lg:top-8">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-ink/40">Preview</p>
        <div
          className="relative mt-2 aspect-[4/5] overflow-hidden bg-ink/[0.04]"
          style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
        >
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-sans text-xs text-ink/30">
              No image yet
            </div>
          )}
        </div>
        <div className="mt-3">
          <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.12em] text-ink/40">
            {CATEGORIES.find((c) => c.value === category)?.label}
          </span>
          <h3 className="mt-1 font-sans text-lg font-bold text-ink">{name || "Product name"}</h3>
          <p className="mt-1 font-mono text-sm text-ink/70">{price ? `${formatPrice(Number(price))} L.E` : "— L.E"}</p>
        </div>
      </div>
    </form>
  );
}
