// app/(storefront)/page.tsx
import Link from "next/link";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ProductsSection } from "@/components/ProductsSection";
import { FamilyGrid } from "@/components/FamilyGrid";

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSlideshow />

      {/* Shop by family — the store's actual taxonomy, edge to edge */}
      <section className="border-b border-line py-14 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="label text-graphite">Shop by family</p>
              <h2 className="display-lg mt-2 text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink">
                Six families, one standard
              </h2>
            </div>
            <Link
              href="/instruments"
              className="hidden shrink-0 font-sans text-sm font-semibold text-ink underline-offset-4 hover:underline sm:block"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="mt-8 lg:mt-10">
          <FamilyGrid />
        </div>
      </section>

      {/* Catalog */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <p className="label text-graphite">The collection</p>
          <h2 className="display-lg mt-2 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink">
            Every instrument here has been played before it was listed
          </h2>
          <p className="mt-4 max-w-xl font-sans text-[0.95rem] leading-relaxed text-graphite">
            A brass play button means we&apos;ve recorded that exact instrument, so you can hear
            it before it ships.
          </p>

          <ProductsSection />
        </div>
      </section>
    </div>
  );
}
