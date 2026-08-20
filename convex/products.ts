// convex/products.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

const categoryValidator = v.union(
  v.literal("guitars"),
  v.literal("keyboards"),
  v.literal("drums"),
  v.literal("brass"),
  v.literal("violins"),
  v.literal("woodwinds"),
  v.literal("accessories")
);

const badgeValidator = v.union(v.literal("Limited Edition"), v.literal("Pre-Order"));

function buildSearchText(name: string, brand: string, description: string) {
  return [name, brand, description].filter(Boolean).join(" ");
}

export const list = query({
  args: {
    category: v.optional(categoryValidator),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { category, paginationOpts }) => {
    const baseQuery = category
      ? ctx.db.query("products").withIndex("by_category", (q) => q.eq("category", category))
      : ctx.db.query("products");

    const result = await baseQuery.order("desc").paginate(paginationOpts);
    return result;
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const product = await ctx.db.get(id);
    if (!product) return null;
    return product;
  },
});

// Called from the admin upload widget before the file itself is sent —
// returns a one-time URL the browser can POST the file bytes to directly.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: categoryValidator,
    brand: v.string(),
    price: v.number(),
    condition: v.union(v.literal("new"), v.literal("used")),
    stock: v.number(),
    badge: v.optional(badgeValidator),
    // Either a direct URL or a freshly uploaded file's storage id — exactly
    // one of each pair should be provided by the caller.
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    sound: v.optional(v.string()),
    soundStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { imageStorageId, soundStorageId, image, sound, ...rest } = args;

    const resolvedImage = imageStorageId ? await ctx.storage.getUrl(imageStorageId) : image;
    if (!resolvedImage) {
      throw new Error("A product image is required.");
    }

    const resolvedSound = soundStorageId ? await ctx.storage.getUrl(soundStorageId) : sound;

    return await ctx.db.insert("products", {
      ...rest,
      image: resolvedImage,
      sound: resolvedSound ?? undefined,
      searchText: buildSearchText(rest.name, rest.brand, rest.description),
      createdAt: Date.now(),
    });
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(categoryValidator),
    brand: v.optional(v.string()),
    price: v.optional(v.number()),
    condition: v.optional(v.union(v.literal("new"), v.literal("used"))),
    stock: v.optional(v.number()),
    badge: v.optional(badgeValidator),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    sound: v.optional(v.string()),
    soundStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, imageStorageId, soundStorageId, image, sound, ...patch }) => {
    const finalPatch: Record<string, unknown> = { ...patch };

    if (patch.name || patch.brand || patch.description) {
      const existing = await ctx.db.get(id);
      if (existing) {
        finalPatch.searchText = buildSearchText(
          patch.name ?? existing.name,
          patch.brand ?? existing.brand,
          patch.description ?? existing.description
        );
      }
    }

    if (imageStorageId) {
      finalPatch.image = await ctx.storage.getUrl(imageStorageId);
    } else if (image) {
      finalPatch.image = image;
    }

    if (soundStorageId) {
      finalPatch.sound = await ctx.storage.getUrl(soundStorageId);
    } else if (sound === "") {
      // Empty string is the admin form's "remove the sound sample" signal —
      // an explicit undefined in a patch unsets the field entirely.
      finalPatch.sound = undefined;
    } else if (sound) {
      finalPatch.sound = sound;
    }

    await ctx.db.patch(id, finalPatch);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const search = query({
  args: {
    term: v.string(),
    category: v.optional(categoryValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { term, category, limit }) => {
    const trimmed = term.trim();
    if (!trimmed) return [];

    const results = await ctx.db
      .query("products")
      .withSearchIndex("search_text", (q) => {
        const base = q.search("searchText", trimmed);
        return category ? base.eq("category", category) : base;
      })
      .take(limit ?? 8);

    return results;
  },
});

// One-off migration: fills in `searchText` for products created before the
// search feature existed. Safe to re-run — it's a no-op for rows that
// already have it. Run once with `npx convex run products:backfillSearchText`.
export const backfillSearchText = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    let updated = 0;
    for (const product of all) {
      if (!product.searchText) {
        await ctx.db.patch(product._id, {
          searchText: buildSearchText(product.name, product.brand, product.description),
        });
        updated++;
      }
    }
    return `Backfilled ${updated} of ${all.length} products.`;
  },
});
