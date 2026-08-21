// app/(storefront)/orders/track/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format";
import { Check, Search } from "lucide-react";

const STAGES = [
  { key: "pending", label: "Placed", note: "We have your order and will call to confirm." },
  { key: "confirmed", label: "Confirmed", note: "Confirmed by phone and being prepared." },
  { key: "shipped", label: "Out for delivery", note: "On its way to your address." },
  { key: "delivered", label: "Delivered", note: "Delivered and paid." },
] as const;

function StatusTrail({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="border border-line bg-stage px-5 py-4">
        <p className="font-sans text-sm font-semibold text-oxblood">Cancelled</p>
        <p className="mt-1 font-sans text-sm text-graphite">
          This order was cancelled. Call us if that is not what you expected.
        </p>
      </div>
    );
  }

  const current = STAGES.findIndex((s) => s.key === status);

  return (
    <ol className="relative">
      {STAGES.map((stage, i) => {
        const done = i <= current;
        const isCurrent = i === current;
        return (
          <li key={stage.key} className="relative flex gap-4 pb-8 last:pb-0">
            {i < STAGES.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[11px] top-6 h-full w-px ${
                  i < current ? "bg-brass" : "bg-line"
                }`}
              />
            )}
            <span
              aria-hidden
              className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                done ? "border-brass bg-brass text-ink" : "border-line bg-paper text-graphite"
              }`}
            >
              {done ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-line" />
              )}
            </span>
            <div>
              <p
                className={`font-sans text-sm font-semibold ${
                  isCurrent ? "text-ink" : done ? "text-graphite" : "text-graphite/60"
                }`}
              >
                {stage.label}
              </p>
              {isCurrent && <p className="mt-1 font-sans text-sm text-graphite">{stage.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TrackForm() {
  const params = useSearchParams();
  const fromLink = params.get("number") ?? "";

  const [number, setNumber] = useState(fromLink);
  // Arriving from the confirmation link already carries the number, so look it
  // up immediately rather than making the customer press a button.
  const [submitted, setSubmitted] = useState(fromLink);

  const result = useQuery(
    api.orders.trackOrder,
    submitted.trim() ? { orderNumber: submitted.trim() } : "skip"
  );

  const canSubmit = number.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="label text-graphite">Track an order</p>
      <h1 className="display-lg mt-3 text-[clamp(1.85rem,4vw,3rem)] text-ink">
        Where is my instrument?
      </h1>
      <p className="mt-4 font-sans text-sm leading-relaxed text-graphite">
        Enter the order number from your confirmation — it looks like JV-ABC12.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          setSubmitted(number.trim());
        }}
        className="mt-10 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={17}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-graphite"
          />
          <label htmlFor="order-number" className="sr-only">
            Order number
          </label>
          <input
            id="order-number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="JV-ABC12"
            autoFocus={!fromLink}
            className="w-full rounded-full border border-line bg-paper py-4 pl-11 pr-4 font-mono text-base uppercase text-ink placeholder:text-graphite/50 focus:border-ink focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="shrink-0 rounded-full bg-ink px-8 py-4 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Track it
        </button>
      </form>

      {submitted && result === undefined && (
        <p className="mt-10 font-sans text-sm text-graphite">Looking…</p>
      )}

      {submitted && result && !result.found && (
        <div className="mt-10 border border-line bg-stage px-5 py-5">
          <p className="font-sans text-sm font-semibold text-ink">
            No order matches that number
          </p>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-graphite">
            Check it against your confirmation — it is five characters after JV-. Still stuck?
            Call us on{" "}
            <a href="tel:+201151845678" className="text-ink underline underline-offset-4">
              +20 115 184 5678
            </a>
            .
          </p>
        </div>
      )}

      {submitted && result?.found && (
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
            <div>
              <p className="label text-[0.6rem] text-graphite">Order</p>
              <p className="mt-1 font-mono text-2xl text-ink">{result.orderNumber}</p>
            </div>
            <p className="font-sans text-sm text-graphite">
              Placed{" "}
              {new Date(result.placedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_1fr]">
            <StatusTrail status={result.status} />

            <div>
              <p className="label text-[0.6rem] text-graphite">Delivering to</p>
              <p className="mt-2 font-sans text-sm text-ink">{result.customerName}</p>
              <p className="font-sans text-sm text-graphite">
                {result.city}
                {result.governorate ? `, ${result.governorate}` : ""}
              </p>

              <p className="label mt-7 text-[0.6rem] text-graphite">Items</p>
              <ul className="mt-2 space-y-2">
                {result.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4 font-sans text-sm">
                    <span className="text-ink">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-graphite"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-graphite">
                      {formatPrice(item.priceAtPurchase * item.quantity)} L.E
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-1.5 border-t border-line pt-4 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-graphite">Shipping</span>
                  <span className="font-mono text-ink">
                    {formatPrice(result.shippingCost)} L.E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-ink">Total to pay</span>
                  <span className="font-mono text-ink">{formatPrice(result.total)} L.E</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-16 border-t border-line pt-6 font-sans text-sm text-graphite">
        Looking for something else?{" "}
        <Link href="/instruments" className="text-ink underline underline-offset-4">
          Browse instruments
        </Link>
      </p>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={<div className="py-24 text-center font-sans text-sm text-graphite">Loading…</div>}
    >
      <TrackForm />
    </Suspense>
  );
}
