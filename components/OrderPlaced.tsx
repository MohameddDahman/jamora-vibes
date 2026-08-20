// components/OrderPlaced.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

/**
 * Shown once an order goes through. The order number is the one thing the
 * customer needs to keep, so it gets the most weight on the screen and a
 * one-tap copy — they will be reading it back to us over the phone.
 */
export function OrderPlaced({
  orderNumber,
  firstName,
  phone,
}: {
  orderNumber: string | null;
  firstName: string;
  phone: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; the number is on screen to read anyway.
    }
  };

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="label text-brass">Order confirmed</p>

      {orderNumber && (
        <div className="mt-7 w-full border border-line bg-stage px-6 py-7">
          <p className="label text-[0.6rem] text-graphite">Your order number</p>
          <p className="mt-2 font-mono text-4xl font-medium tracking-tight text-ink">
            {orderNumber}
          </p>
          <button
            onClick={copy}
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-graphite transition-colors hover:text-ink"
          >
            {copied ? <Check size={13} className="text-sage" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      <h1 className="display-lg mt-9 text-[clamp(1.5rem,3.5vw,2.25rem)] text-ink">
        We&apos;ll call to confirm
      </h1>

      <p className="mt-4 font-sans text-sm leading-relaxed text-graphite">
        Thanks{firstName ? `, ${firstName}` : ""}. We&apos;ll ring {phone} to arrange
        delivery, and you pay the courier in cash when the instrument arrives. Keep your
        order number — you&apos;ll need it to track this order.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href={
            orderNumber
              ? `/orders/track?number=${encodeURIComponent(orderNumber)}`
              : "/orders/track"
          }
          className="rounded-full bg-ink px-8 py-3.5 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
        >
          Track this order
        </Link>
        <Link
          href="/instruments"
          className="rounded-full border border-ink px-8 py-3.5 font-sans text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
