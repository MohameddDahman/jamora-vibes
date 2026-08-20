// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, Menu, X, PackageSearch } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SearchOverlay } from "@/components/SearchOverlay";
import { FAMILIES } from "@/lib/families";

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Instruments", href: "/instruments" },
  { label: "Our Story", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  // Cart count comes from localStorage, which the server can't see. Render
  // "empty" until after mount so hydration always matches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const displayedCount = mounted ? totalItems : 0;

  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Family switcher. Gibson reserves this slot for its sub-brands; here
          the equivalent real division is the six instrument families. */}
      <div className="bg-ink">
        <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <nav aria-label="Instrument families" className="min-w-0 flex-1">
            <ul className="flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FAMILIES.map((family) => {
                const href = `/instruments/${family.slug}`;
                const isActive = pathname === href;
                return (
                  <li key={family.slug}>
                    <Link
                      href={href}
                      className={`label whitespace-nowrap transition-colors ${
                        isActive ? "text-brass" : "text-ivory/55 hover:text-ivory"
                      }`}
                    >
                      {family.short}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex shrink-0 items-center gap-5">
            <p className="hidden font-sans text-[0.7rem] text-ivory/45 xl:block">
              Cash on delivery — nationwide across Egypt
            </p>
            <Link
              href="/orders/track"
              className="flex items-center gap-1.5 whitespace-nowrap font-sans text-[0.7rem] font-semibold text-ivory/80 transition-colors hover:text-brass"
            >
              <PackageSearch size={13} strokeWidth={1.9} />
              Track order
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-line">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="text-ink"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <Link href="/" className="shrink-0">
            <span className="font-display text-[1.15rem] font-extrabold uppercase tracking-[0.16em] text-ink">
              Jamora
            </span>
            <span className="font-display text-[1.15rem] font-medium uppercase tracking-[0.16em] text-graphite">
              {" "}
              Vibes
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative block py-6 font-sans text-sm font-semibold transition-colors ${
                        isActive ? "text-ink" : "text-graphite hover:text-ink"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-ink" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-ink transition-opacity hover:opacity-60"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={1.75} />
            </button>

            <Link
              href="/cart"
              className="relative text-ink transition-opacity hover:opacity-60"
              aria-label={`Cart, ${displayedCount} items`}
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              {displayedCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 font-mono text-[0.6rem] font-medium text-ink">
                  {displayedCount > 9 ? "9+" : displayedCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-b border-line bg-paper lg:hidden">
          <ul className="px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-display text-xl font-bold tracking-tight text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/orders/track"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 font-display text-xl font-bold tracking-tight text-ink"
              >
                <PackageSearch size={18} strokeWidth={2} />
                Track order
              </Link>
            </li>
          </ul>
          <div className="border-t border-line px-4 py-4 sm:px-6">
            <p className="label text-graphite">Families</p>
            <ul className="mt-3 grid grid-cols-2 gap-y-2.5">
              {FAMILIES.map((family) => (
                <li key={family.slug}>
                  <Link
                    href={`/instruments/${family.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-sans text-sm text-graphite hover:text-ink"
                  >
                    {family.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
