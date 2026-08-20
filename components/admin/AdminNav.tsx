// components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Truck, ClipboardList } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/shipping", label: "Shipping Rates", icon: Truck },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-1">
      {NAV.map((item) => {
        const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-2.5 py-2 font-sans text-sm transition-colors ${
              isActive ? "bg-ink text-ivory" : "text-ink/60 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            <item.icon size={16} strokeWidth={1.6} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
