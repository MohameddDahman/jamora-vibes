// app/(storefront)/instruments/page.tsx
import { FamilyGrid } from "@/components/FamilyGrid";

export const metadata = {
  title: "Instruments — Jamora Vibes",
};

export default function InstrumentsPage() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <p className="label text-graphite">All families</p>
        <h1 className="display-lg mt-2 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
          Pick a family. Hear what&apos;s in it.
        </h1>
        <p className="mt-5 max-w-xl font-sans text-[0.95rem] leading-relaxed text-graphite">
          Six families, each stocked by people who play them. A brass play button means we&apos;ve
          recorded that exact instrument.
        </p>
      </div>

      <FamilyGrid />
    </div>
  );
}
