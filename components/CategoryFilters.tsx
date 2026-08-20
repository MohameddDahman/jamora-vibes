// components/CategoryFilters.tsx
import { Doc } from "@/convex/_generated/dataModel";

type Category = Doc<"products">["category"];

const FILTERS: { label: string; value: Category | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Guitars", value: "guitars" },
  { label: "Pianos", value: "keyboards" },
  { label: "Violins", value: "violins" },
  { label: "Brass", value: "brass" },
  { label: "Drums", value: "drums" },
  { label: "Accessories", value: "accessories" },
];

export function CategoryFilters({
  active,
  onSelect,
}: {
  active?: Category;
  onSelect: (category: Category | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = active === filter.value;
        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => onSelect(filter.value)}
            aria-pressed={isActive}
            className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              isActive
                ? "border-ink bg-ink text-ivory"
                : "border-line text-graphite hover:border-ink hover:text-ink"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
