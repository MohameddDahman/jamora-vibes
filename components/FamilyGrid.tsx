// components/FamilyGrid.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FAMILIES } from "@/lib/families";

export function FamilyGrid() {
  return (
    <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-3">
      {FAMILIES.map((family) => (
        <Link
          key={family.slug}
          href={`/instruments/${family.slug}`}
          className="group relative aspect-[4/3] overflow-hidden bg-ink"
        >
          <Image
            src={family.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover opacity-70 transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
            <h3 className="display-md text-xl text-ivory sm:text-2xl">{family.label}</h3>
            <p className="mt-1.5 hidden max-w-[26ch] font-sans text-[0.8rem] leading-relaxed text-ivory/60 sm:block">
              {family.blurb}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brass">
              Shop
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
