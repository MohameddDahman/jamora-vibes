// app/(storefront)/instruments/drums/page.tsx
import { FamilyCatalog } from "@/components/FamilyCatalog";

export const metadata = {
  title: "Drums — Jamora Vibes",
};

export default function DrumsPage() {
  return <FamilyCatalog category="drums" />;
}
