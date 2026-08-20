// app/(storefront)/instruments/brass/page.tsx
import { FamilyCatalog } from "@/components/FamilyCatalog";

export const metadata = {
  title: "Brass — Jamora Vibes",
};

export default function BrassPage() {
  return <FamilyCatalog category="brass" />;
}
