// components/Footer.tsx
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FAMILIES } from "@/lib/families";

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 8.5h-2a2 2 0 0 0-2 2V21M8 13h5" />
      <path d="M13.2 3H6.8A3.8 3.8 0 0 0 3 6.8v10.4A3.8 3.8 0 0 0 6.8 21h10.4a3.8 3.8 0 0 0 3.8-3.8V6.8A3.8 3.8 0 0 0 17.2 3Z" />
    </svg>
  );
}

const COMPANY_LINKS = [
  { label: "Our story", href: "/about" },
  { label: "All instruments", href: "/instruments" },
  { label: "Your cart", href: "/cart" },
  { label: "Track an order", href: "/orders/track" },
];

export function Footer() {
  return (
    <footer className="w-full bg-ink text-ivory">
      <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.16em]">
              Jamora
            </span>
            <span className="font-display text-lg font-medium uppercase tracking-[0.16em] text-ivory/50">
              {" "}
              Vibes
            </span>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-ivory/50">
              Instruments chosen by people who play them, and recorded so you can hear one
              before it ships.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 text-ivory/60 transition-colors hover:border-brass hover:text-brass"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 text-ivory/60 transition-colors hover:border-brass hover:text-brass"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="label text-brass">Families</p>
            <ul className="mt-5 space-y-3">
              {FAMILIES.map((family) => (
                <li key={family.slug}>
                  <Link
                    href={`/instruments/${family.slug}`}
                    className="font-sans text-sm text-ivory/55 transition-colors hover:text-ivory"
                  >
                    {family.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-brass">Jamora Vibes</p>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-ivory/55 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-brass">Get in touch</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="tel:+201000000000"
                  className="flex items-center gap-2.5 font-sans text-sm text-ivory/55 transition-colors hover:text-ivory"
                >
                  <Phone size={14} strokeWidth={1.5} className="shrink-0 text-ivory/35" />
                  +20 10 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@jamoravibes.com"
                  className="flex items-center gap-2.5 font-sans text-sm text-ivory/55 transition-colors hover:text-ivory"
                >
                  <Mail size={14} strokeWidth={1.5} className="shrink-0 text-ivory/35" />
                  hello@jamoravibes.com
                </a>
              </li>
            </ul>
            <p className="mt-5 font-sans text-xs leading-relaxed text-ivory/35">
              Cairo, Egypt. Shipping nationwide, cash on delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-10">
          <p className="font-sans text-xs text-ivory/35">
            © {new Date().getFullYear()} Jamora Vibes
          </p>
          <p className="label text-[0.6rem] text-ivory/30">Hear it before you buy it</p>
        </div>
      </div>
    </footer>
  );
}
