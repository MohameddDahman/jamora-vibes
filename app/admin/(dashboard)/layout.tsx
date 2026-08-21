// app/admin/(dashboard)/layout.tsx
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminMobileBar } from "@/components/admin/AdminMobileBar";
import { logout } from "@/app/admin/login/actions";

export const metadata = {
  title: "Admin — Jamora Vibes",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f1ec] font-sans text-ink lg:flex">
      <AdminMobileBar />

      <aside className="hidden w-56 shrink-0 border-r border-ink/10 bg-white px-4 py-6 lg:block">
        <Link href="/admin" className="block px-2.5 font-sans text-sm font-semibold uppercase tracking-[0.14em]">
          Jamora <span className="text-brass">Admin</span>
        </Link>

        <AdminNav />

        <Link
          href="/"
          className="mt-8 block px-2.5 font-sans text-xs text-ink/40 transition-colors hover:text-ink"
        >
          ← Back to store
        </Link>

        <form action={logout} className="mt-2">
          <button
            type="submit"
            className="block px-2.5 font-sans text-xs text-ink/40 transition-colors hover:text-oxblood"
          >
            Log out
          </button>
        </form>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
