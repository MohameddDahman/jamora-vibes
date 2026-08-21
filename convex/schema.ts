// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),

    category: v.union(
      v.literal("guitars"),
      v.literal("keyboards"),
      v.literal("drums"),
      v.literal("brass"),
      v.literal("violins"),
      v.literal("woodwinds"),
      v.literal("accessories")
    ),

    brand: v.string(),
    price: v.number(), // L.E, whole number

    condition: v.union(v.literal("new"), v.literal("used")),

    stock: v.number(),

    badge: v.optional(v.union(v.literal("Limited Edition"), v.literal("Pre-Order"))),

    image: v.string(), // resolved URL — either an admin upload (Convex storage) or an external link

    sound: v.optional(v.string()), // resolved URL — either an admin upload (Convex storage) or an external link

    // Denormalized "name + brand + description" — kept in sync by
    // createProduct/updateProduct — so search can match across all three
    // with a single Convex search index (which only indexes one field).
    // Optional so existing rows don't need a migration before this field
    // existed; backfillSearchText fills them in once.
    searchText: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .searchIndex("search_text", {
      searchField: "searchText",
      filterFields: ["category"],
    }),

  // Small key/value store for things the admin can change that are not
  // products or orders - currently just the Our Story audio track.
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  shippingRates: defineTable({
    governorate: v.string(),
    fee: v.number(), // L.E, flat COD shipping fee for this governorate
  }).index("by_governorate", ["governorate"]),

  orders: defineTable({
    // Short, human-readable reference the customer can quote on the phone.
    // Optional so orders created before this field existed still validate;
    // every new order gets one.
    orderNumber: v.optional(v.string()),

    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(), // snapshot at time of order
        quantity: v.number(),
        priceAtPurchase: v.number(), // L.E, per unit
      })
    ),

    customerName: v.string(),
    customerEmail: v.optional(v.string()), // not collected on the checkout form
    customerPhone: v.string(), // required — COD needs a reliable contact number

    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.optional(v.string()), // governorate
      postalCode: v.optional(v.string()), // not commonly used in Egypt addresses
      country: v.string(),
    }),

    status: v.union(
      v.literal("pending"), // order placed, not yet confirmed
      v.literal("confirmed"), // admin confirmed, preparing for delivery
      v.literal("shipped"), // out for delivery
      v.literal("delivered"), // delivered, cash collected
      v.literal("cancelled")
    ),

    subtotal: v.number(), // L.E
    shippingCost: v.number(), // L.E
    total: v.number(), // L.E — amount to collect on delivery

    notes: v.optional(v.string()), // optional customer note, e.g. delivery instructions

    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_email", ["customerEmail"])
    .index("by_orderNumber", ["orderNumber"]),
});