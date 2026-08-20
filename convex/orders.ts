// convex/orders.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("shipped"),
  v.literal("delivered"),
  v.literal("cancelled")
);

// Ambiguous characters are left out so a number read over the phone cannot
// be misheard: no O/0, I/1, S/5, B/8.
const CODE_ALPHABET = "ACDEFGHJKLMNPQRTUVWXYZ2346789";
const CODE_LENGTH = 5;

function makeCode() {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `JV-${out}`;
}

export const createOrder = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        quantity: v.number(),
        priceAtPurchase: v.number(),
      })
    ),
    customerName: v.string(),
    customerPhone: v.string(),
    shippingAddress: v.object({
      line1: v.string(),
      city: v.string(),
      state: v.string(), // governorate
    }),
    subtotal: v.number(),
    shippingCost: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    // Short codes can collide, so re-roll a few times before giving up.
    let orderNumber = makeCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const clash = await ctx.db
        .query("orders")
        .withIndex("by_orderNumber", (q) => q.eq("orderNumber", orderNumber))
        .first();
      if (!clash) break;
      orderNumber = makeCode();
    }

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      items: args.items,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      shippingAddress: {
        line1: args.shippingAddress.line1,
        city: args.shippingAddress.city,
        state: args.shippingAddress.state,
        country: "Egypt",
      },
      status: "pending",
      subtotal: args.subtotal,
      shippingCost: args.shippingCost,
      total: args.total,
      createdAt: Date.now(),
    });
    return { orderId, orderNumber };
  },
});

export const list = query({
  args: {
    status: v.optional(statusValidator),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { status, paginationOpts }) => {
    const baseQuery = status
      ? ctx.db.query("orders").withIndex("by_status", (q) => q.eq("status", status))
      : ctx.db.query("orders");

    return await baseQuery.order("desc").paginate(paginationOpts);
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Permanently removes an order. Cancelling (updateStatus) is the right
// move for a real order that fell through - this is for clearing test rows
// and junk, and it cannot be undone.
export const deleteOrder = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    const order = await ctx.db.get(id);
    if (!order) return { deleted: false as const };

    await ctx.db.delete(id);
    return { deleted: true as const, orderNumber: order.orderNumber ?? null };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: statusValidator,
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

// Customer-facing lookup. Order numbers are short and therefore guessable,
// so the phone number on the order must match before anything is returned.
// Only the fields needed to track delivery are exposed - never the full
// address of someone elses order.
// Customer-facing lookup by order number alone, so tracking takes one field.
// The street address is deliberately never returned.
export const trackOrder = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, { orderNumber }) => {
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return { found: false as const };

    // Keep only letters and digits, so the code is found whether it was
    // typed with the JV- prefix, a space, a dash, or none of them. Written
    // without a regex on purpose - escape sequences do not survive this
    // toolchain reliably, and a silently broken character class here would
    // corrupt valid order numbers.
    const alnum = Array.from(trimmed)
      .filter((c) => (c >= "A" && c <= "Z") || (c >= "0" && c <= "9"))
      .join("");
    const bare = alnum.startsWith("JV") ? alnum.slice(2) : alnum;
    if (!bare) return { found: false as const };
    const withPrefix = `JV-${bare}`;

    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", withPrefix))
      .first();

    if (!order) return { found: false as const };

    return {
      found: true as const,
      orderNumber: order.orderNumber ?? withPrefix,
      status: order.status,
      placedAt: order.createdAt,
      customerName: order.customerName,
      city: order.shippingAddress.city,
      governorate: order.shippingAddress.state ?? "",
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        priceAtPurchase: i.priceAtPurchase,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
    };
  },
});

// One-off: give order numbers to rows created before the field existed.
export const backfillOrderNumbers = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("orders").collect();
    let filled = 0;
    for (const order of all) {
      if (order.orderNumber) continue;
      await ctx.db.patch(order._id, { orderNumber: makeCode() });
      filled++;
    }
    return `Filled ${filled} of ${all.length} orders.`;
  },
});
