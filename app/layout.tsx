// app/layout.tsx
import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Display: heavy, tight, slightly mechanical — the stance of gear branding.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700", "800"],
});

// Body: neutral on purpose. All the character lives in the display face.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Utility: prices, specs, counters — reads like studio equipment labelling.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Jamora Vibes",
  description: "Instruments worth hearing before you buy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          <CartProvider>{children}</CartProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
