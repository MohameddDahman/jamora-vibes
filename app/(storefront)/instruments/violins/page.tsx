// app/(storefront)/instruments/violins/page.tsx
import { FamilyCatalog } from "@/components/FamilyCatalog";

export const metadata = {
  title: "Violins — Jamora Vibes",
};

export default function ViolinsPage() {
  return <FamilyCatalog category="violins" />;
}
