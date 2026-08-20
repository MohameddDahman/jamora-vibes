// convex/shipping.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { DEFAULT_SHIPPING_FEE } from "../lib/governorates";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("shippingRates").collect();
  },
});

export const getRate = query({
  args: { governorate: v.string() },
  handler: async (ctx, { governorate }) => {
    const rate = await ctx.db
      .query("shippingRates")
      .withIndex("by_governorate", (q) => q.eq("governorate", governorate))
      .unique();
    return rate?.fee ?? DEFAULT_SHIPPING_FEE;
  },
});

export const upsertRate = mutation({
  args: {
    governorate: v.string(),
    fee: v.number(),
  },
  handler: async (ctx, { governorate, fee }) => {
    if (fee < 0) throw new Error("Shipping fee can't be negative.");

    const existing = await ctx.db
      .query("shippingRates")
      .withIndex("by_governorate", (q) => q.eq("governorate", governorate))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { fee });
    } else {
      await ctx.db.insert("shippingRates", { governorate, fee });
    }
  },
});
