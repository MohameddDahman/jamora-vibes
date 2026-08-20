// lib/families.ts
//
// The six instrument families are the store's real taxonomy — they drive the
// top-level navigation, the family grid, and the category routes. Keeping them
// in one place means the nav and the pages can never drift apart.

export type FamilyCategory =
  | "guitars"
  | "keyboards"
  | "violins"
  | "brass"
  | "drums"
  | "accessories";

export type Family = {
  label: string;
  short: string;
  category: FamilyCategory;
  slug: string;
  image: string;
  blurb: string;
};

export const FAMILIES: Family[] = [
  {
    label: "Acoustic Guitars",
    short: "Guitars",
    category: "guitars",
    slug: "guitars",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1400",
    blurb: "Steel-string and classical, braced the old way.",
  },
  {
    label: "Pianos",
    short: "Pianos",
    category: "keyboards",
    slug: "pianos",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=1400",
    blurb: "Grands and uprights, tuned and voiced before shipping.",
  },
  {
    label: "Violins",
    short: "Violins",
    category: "violins",
    slug: "violins",
    image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=1400",
    blurb: "Hand-carved tops, set up and ready to bow.",
  },
  {
    label: "Brass",
    short: "Brass",
    category: "brass",
    slug: "brass",
    image: "https://images.unsplash.com/photo-1573871669414-010dbf73ca84?w=1400",
    blurb: "Trumpets and horns with hand-lapped valves.",
  },
  {
    label: "Drums",
    short: "Drums",
    category: "drums",
    slug: "drums",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1400",
    blurb: "Shell packs built for the stage and the room.",
  },
  {
    label: "Accessories",
    short: "Accessories",
    category: "accessories",
    slug: "accessories",
    image:
      "https://storage.googleapis.com/content-assistant-images-persistent/flat-lay-of-essential-acoustic-guitar-accessories-including-strings-picks-and-a-capo-f0186630-e1e0-47d8-adb9-0e9f22b6148d.webp",
    blurb: "Strings, capos, cases and care kits.",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  guitars: "Acoustic Guitar",
  keyboards: "Piano",
  drums: "Drums",
  brass: "Brass",
  violins: "Violin",
  woodwinds: "Woodwind",
  accessories: "Accessories",
};
