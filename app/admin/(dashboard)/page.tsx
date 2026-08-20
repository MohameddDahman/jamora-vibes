// app/admin/(dashboard)/page.tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EGYPT_GOVERNORATES } from "@/lib/governorates";
import { formatPrice } from "@/lib/format";
import { formatDate } from "@/lib/date";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Package, Truck, ClipboardList, ArrowRight } from "lucide-react";

export default function AdminOverviewPage() {
  const products = useQuery(api.products.list, { paginationOpts: { numItems: 500, cursor: null } });
  const shippingRates = useQuery(api.shipping.list);
  const orders = useQuery(api.orders.list, { paginationOpts: { numItems: 500, cursor: null } });
  const pendingOrders = useQuery(api.orders.list, {
    status: "pending",
    paginationOpts: { numItems: 500, cursor: null },
  });

  const productCount = products?.page.length;
  const outOfStock = products?.page.filter((p) => p.stock === 0).length;
  const ratesConfigured = shippingRates?.length ?? 0;
  const recentOrders = orders?.page.slice(0, 5);

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold text-ink">Overview</h1>
      <p className="mt-1 font-sans text-sm text-ink/50">A quick look at the store.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Link
          href="/admin/orders"
          className="group flex items-center justify-between border border-ink/10 bg-white p-6 transition-colors hover:border-brass"
        >
          <div>
            <div className="flex items-center gap-2 text-ink/40">
              <ClipboardList size={16} strokeWidth={1.6} />
              <span className="font-sans text-xs uppercase tracking-[0.1em]">Orders</span>
            </div>
            <p className="mt-3 font-sans text-3xl font-semibold text-ink">{orders?.page.length ?? "—"}</p>
            <p className="mt-1 font-sans text-xs text-ink/40">
              {pendingOrders !== undefined ? `${pendingOrders.page.length} pending` : "Loading…"}
            </p>
          </div>
          <ArrowRight size={16} className="text-ink/20 transition-transform group-hover:translate-x-1 group-hover:text-brass" />
        </Link>

        <Link
          href="/admin/products"
          className="group flex items-center justify-between border border-ink/10 bg-white p-6 transition-colors hover:border-brass"
        >
          <div>
            <div className="flex items-center gap-2 text-ink/40">
              <Package size={16} strokeWidth={1.6} />
              <span className="font-sans text-xs uppercase tracking-[0.1em]">Products</span>
            </div>
            <p className="mt-3 font-sans text-3xl font-semibold text-ink">{productCount ?? "—"}</p>
            <p className="mt-1 font-sans text-xs text-ink/40">
              {outOfStock !== undefined ? `${outOfStock} out of stock` : "Loading…"}
            </p>
          </div>
          <ArrowRight size={16} className="text-ink/20 transition-transform group-hover:translate-x-1 group-hover:text-brass" />
        </Link>

        <Link
          href="/admin/shipping"
          className="group flex items-center justify-between border border-ink/10 bg-white p-6 transition-colors hover:border-brass"
        >
          <div>
            <div className="flex items-center gap-2 text-ink/40">
              <Truck size={16} strokeWidth={1.6} />
              <span className="font-sans text-xs uppercase tracking-[0.1em]">Shipping Rates</span>
            </div>
            <p className="mt-3 font-sans text-3xl font-semibold text-ink">
              {ratesConfigured}
              <span className="text-lg font-normal text-ink/30">/{EGYPT_GOVERNORATES.length}</span>
            </p>
            <p className="mt-1 font-sans text-xs text-ink/40">Governorates configured</p>
          </div>
          <ArrowRight size={16} className="text-ink/20 transition-transform group-hover:translate-x-1 group-hover:text-brass" />
        </Link>
      </div>

      <div className="mt-10 border border-ink/10 bg-white">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-ink/50">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="font-sans text-xs font-medium text-brass hover:opacity-70">
            View all
          </Link>
        </div>

        {recentOrders && recentOrders.length === 0 && (
          <p className="px-6 py-8 text-center font-sans text-sm text-ink/40">No orders yet.</p>
        )}

        {recentOrders?.map((order) => (
          <Link
            key={order._id}
            href={`/admin/orders/${order._id}`}
            className="flex items-center justify-between gap-4 border-b border-ink/5 px-6 py-4 last:border-0 hover:bg-ink/[0.02]"
          >
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-medium text-ink">{order.customerName}</p>
              <p className="font-sans text-xs text-ink/40">
                {formatDate(order.createdAt)} · {order.shippingAddress.state}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-mono text-sm text-ink">{formatPrice(order.total)} L.E</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
