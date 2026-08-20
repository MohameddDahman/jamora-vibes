// components/admin/OrderStatusBadge.tsx
import { Doc } from "@/convex/_generated/dataModel";

type Status = Doc<"orders">["status"];

const STYLES: Record<Status, string> = {
  pending: "bg-brass/15 text-brass",
  confirmed: "bg-ink/10 text-ink/70",
  shipped: "bg-[#6b7550]/15 text-[#6b7550]",
  delivered: "bg-emerald-600/15 text-emerald-700",
  cancelled: "bg-oxblood/10 text-oxblood",
};

const LABELS: Record<Status, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[0.65rem] font-medium uppercase tracking-[0.06em] ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
