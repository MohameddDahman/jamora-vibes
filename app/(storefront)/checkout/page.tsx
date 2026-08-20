// app/(storefront)/checkout/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { EGYPT_GOVERNORATES, DEFAULT_SHIPPING_FEE } from "@/lib/governorates";
import { OrderPlaced } from "@/components/OrderPlaced";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label block text-[0.6rem] text-graphite">{label}</label>
      <div className="mt-2 border border-line bg-paper px-3.5 py-3 transition-colors focus-within:border-ink">
        {children}
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-transparent font-sans text-sm text-ink placeholder:text-graphite/60 focus:outline-none";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);
  const shippingRates = useQuery(api.shipping.list);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [governorateQuery, setGovernorateQuery] = useState("");
  const [governorateOpen, setGovernorateOpen] = useState(false);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredGovernorates = useMemo(() => {
    const q = governorateQuery.trim().toLowerCase();
    if (!q) return EGYPT_GOVERNORATES;
    return EGYPT_GOVERNORATES.filter((g) => g.toLowerCase().includes(q));
  }, [governorateQuery]);

  const shippingCost = useMemo(() => {
    if (!governorate) return DEFAULT_SHIPPING_FEE;
    const match = shippingRates?.find((r) => r.governorate === governorate);
    return match?.fee ?? DEFAULT_SHIPPING_FEE;
  }, [governorate, shippingRates]);

  const total = subtotal + shippingCost;

  const isFormValid =
    fullName.trim() &&
    phone.trim() &&
    governorate.trim() &&
    city.trim() &&
    address.trim() &&
    items.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        shippingAddress: { line1: address.trim(), city: city.trim(), state: governorate },
        subtotal,
        shippingCost,
        total,
      });
      setOrderNumber(created.orderNumber);
      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error(err);
      setError("We couldn't place the order. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <OrderPlaced
        orderNumber={orderNumber}
        firstName={fullName.trim().split(" ")[0]}
        phone={phone}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="display-lg text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 font-sans text-sm text-graphite">
          Add an instrument before checking out.
        </p>
        <Link
          href="/instruments"
          className="mt-8 rounded-full bg-ink px-8 py-3.5 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
        >
          Browse instruments
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      <Link
        href="/cart"
        className="flex w-fit items-center gap-1.5 font-sans text-xs font-medium text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to cart
      </Link>

      <h1 className="display-lg mt-4 text-[clamp(1.75rem,4vw,2.5rem)] text-ink">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="border border-line p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="display-md text-lg text-ink">Where it&apos;s going</h2>
            <span className="label text-[0.6rem] text-graphite">Egypt only</span>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Full name">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Phone number">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 1X XXXX XXXX"
                  required
                  className={inputClass}
                />
              </Field>
              <p className="mt-1.5 font-sans text-xs text-graphite">
                We call this number to arrange delivery.
              </p>
            </div>

            <div className="relative">
              <Field label="Governorate">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={governorateOpen ? governorateQuery : governorate}
                    onChange={(e) => {
                      setGovernorateQuery(e.target.value);
                      setGovernorate("");
                      setGovernorateOpen(true);
                    }}
                    onFocus={() => {
                      setGovernorateQuery("");
                      setGovernorateOpen(true);
                    }}
                    onBlur={() => setTimeout(() => setGovernorateOpen(false), 120)}
                    placeholder="Choose governorate"
                    required
                    className={`${inputClass} pr-5`}
                  />
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-0 text-graphite"
                  />
                </div>
              </Field>

              {governorateOpen && filteredGovernorates.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-line bg-paper shadow-lg">
                  {filteredGovernorates.map((g) => (
                    <li key={g}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setGovernorate(g);
                          setGovernorateQuery("");
                          setGovernorateOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left font-sans text-sm text-ink hover:bg-stage"
                      >
                        {g}
                        {governorate === g && <Check size={13} className="text-brass" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Field label="City / area">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or area"
                required
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Street address">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, building, floor, apartment"
                  required
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border border-line bg-stage px-4 py-4">
            <div>
              <p className="font-sans text-sm font-semibold text-ink">Cash on delivery</p>
              <p className="mt-0.5 font-sans text-xs text-graphite">
                Pay the courier when your instrument arrives
              </p>
            </div>
            <span className="label shrink-0 text-[0.6rem] text-graphite">Only option</span>
          </div>
        </div>

        <aside className="h-fit border border-line p-6 lg:sticky lg:top-32">
          <h2 className="display-md text-lg text-ink">Order</h2>

          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-stage">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain p-1.5"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-semibold text-ink">{item.name}</p>
                  <p className="font-mono text-xs text-graphite">Qty {item.quantity}</p>
                </div>
                <span className="shrink-0 font-mono text-sm text-ink">
                  {formatPrice(item.price * item.quantity)} L.E
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-line pt-5 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-graphite">Subtotal</dt>
              <dd className="font-mono text-ink">{formatPrice(subtotal)} L.E</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-graphite">
                Shipping{!governorate && " (estimate)"}
              </dt>
              <dd className="font-mono text-ink">{formatPrice(shippingCost)} L.E</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="font-sans text-sm font-semibold text-ink">Total</span>
            <span className="font-mono text-xl text-ink">{formatPrice(total)} L.E</span>
          </div>

          {error && <p className="mt-4 font-sans text-sm text-oxblood">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="mt-6 w-full rounded-full bg-ink py-4 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>

          <p className="mt-3 text-center font-sans text-xs text-graphite">
            Nothing is charged now
          </p>
        </aside>
      </form>
    </div>
  );
}
