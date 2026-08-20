// app/(storefront)/layout.tsx
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartToast } from "@/components/CartToast";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <CartToast />
    </div>
  );
}
