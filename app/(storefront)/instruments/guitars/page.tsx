// app/(storefront)/instruments/guitars/page.tsx
import { FamilyCatalog } from "@/components/FamilyCatalog";

export const metadata = {
  title: "Acoustic Guitars — Jamora Vibes",
};

export default function GuitarsPage() {
  return <FamilyCatalog category="guitars" />;
}
