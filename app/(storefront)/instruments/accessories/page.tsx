// app/(storefront)/instruments/accessories/page.tsx
import { FamilyCatalog } from "@/components/FamilyCatalog";

export const metadata = {
  title: "Accessories — Jamora Vibes",
};

export default function AccessoriesPage() {
  return <FamilyCatalog category="accessories" />;
}
