// components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Truck, ClipboardList } from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/shipping", label: "Shipping Rates", icon: Truck },
];

export function isAdminRouteActive(href: string, pathname: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-1">
      {ADMIN_NAV.map((item) => {
        const isActive = isAdminRouteActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
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
