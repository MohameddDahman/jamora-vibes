// app/admin/(dashboard)/orders/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { formatPrice } from "@/lib/format";
import { formatDate } from "@/lib/date";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

type Status = Doc<"orders">["status"];

const FILTERS: { label: string; value: Status | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const orders = useQuery(api.orders.list, { status, paginationOpts: { numItems: 200, cursor: null } });

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold text-ink">Orders</h1>
      <p className="mt-1 font-sans text-sm text-ink/50">
        {orders ? `${orders.page.length} total` : "Loading…"}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = status === filter.value;
          return (
            <button
              key={filter.label}
              onClick={() => setStatus(filter.value)}
              className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.06em] transition-colors ${
                isActive ? "border-ink bg-ink text-ivory" : "border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10 font-sans text-xs uppercase tracking-[0.08em] text-ink/40">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Governorate</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {orders?.page.map((order) => (
              <tr key={order._id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-ink">
                    {order.orderNumber ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-ink">{order.customerName}</p>
                  <p className="font-sans text-xs text-ink/40">{order.customerPhone}</p>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-ink/60">{order.shippingAddress.state}</td>
                <td className="px-4 py-3 font-mono text-sm text-ink/70">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-ink">{formatPrice(order.total)} L.E</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 font-sans text-xs text-ink/40">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-brass hover:opacity-70"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {orders && orders.page.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-sans text-sm text-ink/40">
                  No orders {status ? "with this status " : ""}yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
