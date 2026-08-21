// components/admin/AdminMobileBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Store, LogOut } from "lucide-react";
import { ADMIN_NAV, isAdminRouteActive } from "@/components/admin/AdminNav";
import { logout } from "@/app/admin/login/actions";

/**
 * The sidebar is hidden below lg, which previously left phones with no admin
 * navigation at all. This is the small-screen equivalent: a sticky bar with
 * the current section name and a drawer holding the same links.
 */
export function AdminMobileBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current =
    ADMIN_NAV.find((item) => isAdminRouteActive(item.href, pathname))?.label ?? "Admin";

  return (
    <div className="sticky top-0 z-40 lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 border-b border-ivory/10 bg-ink px-4">
        <Link href="/admin" className="min-w-0">
          <span className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ivory">
            Jamora <span className="text-brass">Admin</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="truncate font-sans text-xs text-ivory/45">{current}</span>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close admin menu" : "Open admin menu"}
            aria-expanded={open}
            className="text-ivory"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-ink/10 bg-white shadow-lg">
          <nav className="px-3 py-2">
            {ADMIN_NAV.map((item) => {
              const isActive = isAdminRouteActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-sm px-3 py-3 font-sans text-sm transition-colors ${
                    isActive ? "bg-ink text-ivory" : "text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  <item.icon size={17} strokeWidth={1.6} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-between border-t border-ink/10 px-6 py-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-sans text-xs text-ink/50 transition-colors hover:text-ink"
            >
              <Store size={13} strokeWidth={1.6} />
              Back to store
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 font-sans text-xs text-ink/50 transition-colors hover:text-oxblood"
              >
                <LogOut size={13} strokeWidth={1.6} />
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
