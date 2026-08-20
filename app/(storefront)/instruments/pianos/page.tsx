// app/(storefront)/instruments/pianos/page.tsx
import { FamilyCatalog } from "@/components/FamilyCatalog";

export const metadata = {
  title: "Pianos — Jamora Vibes",
};

export default function PianosPage() {
  return <FamilyCatalog category="keyboards" />;
}
