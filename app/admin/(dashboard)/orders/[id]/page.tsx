// app/admin/(dashboard)/orders/[id]/page.tsx
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/lib/date";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { ArrowLeft, Phone, MapPin, Check, Trash2 } from "lucide-react";

type Status = Doc<"orders">["status"];

const STATUS_FLOW: Status[] = ["pending", "confirmed", "shipped", "delivered"];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = useQuery(api.orders.getById, { id: id as Id<"orders"> });
  const updateStatus = useMutation(api.orders.updateStatus);
  const deleteOrder = useMutation(api.orders.deleteOrder);
  const router = useRouter();

  const [justSaved, setJustSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (status: Status) => {
    await updateStatus({ id: id as Id<"orders">, status });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleDelete = async (label: string) => {
    const ok = confirm(
      `Delete ${label} permanently? This cannot be undone. To keep a record instead, set the status to Cancelled.`
    );
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteOrder({ id: id as Id<"orders"> });
      router.push("/admin/orders");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/orders"
        className="flex items-center gap-1.5 font-sans text-xs font-medium text-ink/50 transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {order === undefined && <p className="mt-8 font-sans text-sm text-ink/40">Loading…</p>}
      {order === null && <p className="mt-8 font-sans text-sm text-ink/40">This order couldn&apos;t be found.</p>}

      {order && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-sans text-2xl font-semibold text-ink">
                  {order.orderNumber ?? `Order #${order._id.slice(-6).toUpperCase()}`}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 font-sans text-sm text-ink/40">Placed {formatDateTime(order.createdAt)}</p>
            </div>

            {justSaved && (
              <span className="inline-flex items-center gap-1.5 font-sans text-xs text-emerald-600">
                <Check size={14} strokeWidth={2.5} /> Status updated
              </span>
            )}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Items */}
              <div className="border border-ink/10 bg-white p-6">
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-ink/50">
                  Items
                </h2>
                <div className="mt-4 divide-y divide-ink/5">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-medium text-ink">{item.name}</p>
                        <p className="font-mono text-xs text-ink/40">
                          Qty {item.quantity} × {formatPrice(item.priceAtPurchase)} L.E
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-sm text-ink">
                        {formatPrice(item.quantity * item.priceAtPurchase)} L.E
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 font-mono text-sm">
                  <div className="flex justify-between text-ink/60">
                    <span className="font-sans">Subtotal</span>
                    <span>{formatPrice(order.subtotal)} L.E</span>
                  </div>
                  <div className="flex justify-between text-ink/60">
                    <span className="font-sans">Shipping</span>
                    <span>{formatPrice(order.shippingCost)} L.E</span>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
                    <span className="font-sans">Total (COD)</span>
                    <span>{formatPrice(order.total)} L.E</span>
                  </div>
                </div>
              </div>

              {/* Update status */}
              <div className="border border-ink/10 bg-white p-6">
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-ink/50">
                  Update Status
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={order.status === s}
                      className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.06em] transition-colors ${
                        order.status === s
                          ? "border-ink bg-ink text-ivory"
                          : "border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={order.status === "cancelled"}
                    className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.06em] transition-colors ${
                      order.status === "cancelled"
                        ? "border-oxblood bg-oxblood text-ivory"
                        : "border-oxblood/30 text-oxblood/70 hover:border-oxblood hover:text-oxblood"
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="border border-ink/10 bg-white p-6">
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-ink/50">
                  Customer
                </h2>
                <p className="mt-3 font-sans text-sm font-medium text-ink">{order.customerName}</p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="mt-1.5 flex items-center gap-1.5 font-sans text-sm text-ink/60 hover:text-brass"
                >
                  <Phone size={13} strokeWidth={1.5} />
                  {order.customerPhone}
                </a>
              </div>

              <div className="border border-ink/10 bg-white p-6">
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-ink/50">
                  Shipping Address
                </h2>
                <div className="mt-3 flex items-start gap-1.5">
                  <MapPin size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink/40" />
                  <p className="font-sans text-sm leading-relaxed text-ink/70">
                    {order.shippingAddress.line1}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div className="border border-ink/10 bg-[#faf8f4] p-6">
                <p className="font-sans text-sm font-medium text-ink">Cash on Delivery</p>
                <p className="mt-1 font-sans text-xs leading-relaxed text-ink/50">
                  Collect {formatPrice(order.total)} L.E in cash when the order is delivered.
                </p>
              </div>
            </div>
          </div>

          {/* Destructive action, kept well away from the status controls */}
          <div className="mt-10 border-t border-ink/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-sans text-sm font-medium text-ink">Delete this order</p>
                <p className="mt-0.5 max-w-md font-sans text-xs leading-relaxed text-ink/50">
                  Removes it permanently. If the customer simply changed their mind, set the
                  status to Cancelled instead so you keep the record.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    order.orderNumber ?? `order #${order._id.slice(-6).toUpperCase()}`
                  )
                }
                disabled={deleting}
                className="flex shrink-0 items-center gap-1.5 border border-oxblood/30 px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.08em] text-oxblood transition-colors hover:bg-oxblood hover:text-white disabled:opacity-40"
              >
                <Trash2 size={14} />
                {deleting ? "Deleting…" : "Delete order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
