// app/(storefront)/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { RelatedProducts } from "@/components/RelatedProducts";
import { DEFAULT_SHIPPING_FEE } from "@/lib/governorates";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex min-h-[38vh] flex-col items-center justify-center text-center">
          <h1 className="display-lg text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-sm font-sans text-sm text-graphite">
            Nothing here yet. Start with a family, or hear what&apos;s new.
          </p>
          <Link
            href="/instruments"
            className="mt-8 rounded-full bg-ink px-8 py-3.5 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
          >
            Browse instruments
          </Link>
        </div>

        <RelatedProducts limit={4} title="Popular right now" />
      </div>
    );
  }

  const total = subtotal + DEFAULT_SHIPPING_FEE;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="display-lg text-[clamp(1.75rem,4vw,2.5rem)] text-ink">Cart</h1>
      <p className="mt-2 font-sans text-sm text-graphite">
        {items.length} {items.length === 1 ? "instrument" : "instruments"}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-5 py-6">
              <Link
                href={`/products/${item.productId}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden bg-stage"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2.5"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/products/${item.productId}`} className="min-w-0">
                    <h2 className="font-display text-base font-bold tracking-tight text-ink">
                      {item.name}
                    </h2>
                  </Link>
                  <span className="shrink-0 font-mono text-sm text-ink">
                    {formatPrice(item.price * item.quantity)} L.E
                  </span>
                </div>

                {item.quantity > 1 && (
                  <p className="mt-1 font-mono text-xs text-graphite">
                    {formatPrice(item.price)} L.E each
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-stage disabled:opacity-25"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-9 text-center font-mono text-sm text-ink">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-stage disabled:opacity-25"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-1.5 font-sans text-xs font-medium text-graphite transition-colors hover:text-oxblood"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-line p-6 lg:sticky lg:top-32">
          <h2 className="display-md text-lg text-ink">Summary</h2>

          <dl className="mt-6 space-y-3 border-b border-line pb-5 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-graphite">Subtotal</dt>
              <dd className="font-mono text-ink">{formatPrice(subtotal)} L.E</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-graphite">Shipping (estimate)</dt>
              <dd className="font-mono text-ink">{formatPrice(DEFAULT_SHIPPING_FEE)} L.E</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-baseline justify-between">
            <span className="font-sans text-sm font-semibold text-ink">Total</span>
            <span className="font-mono text-xl text-ink">{formatPrice(total)} L.E</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-ink py-4 text-center font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
          >
            Checkout
          </Link>

          <p className="mt-4 font-sans text-xs leading-relaxed text-graphite">
            Shipping is confirmed once you pick your governorate. You pay cash when the
            instrument reaches your door.
          </p>
        </aside>
      </div>

      <RelatedProducts excludeIds={items.map((i) => i.productId)} limit={4} />
    </div>
  );
}
