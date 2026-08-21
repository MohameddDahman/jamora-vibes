// convex/settings.ts
import { query, mutation, type QueryCtx, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// The audio played by the transport bar on the Our Story page.
export const STORY_AUDIO_KEY = "storyAudioUrl";

async function readSetting(ctx: QueryCtx | MutationCtx, key: string) {
  return await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();
}

export const getStoryAudio = query({
  args: {},
  handler: async (ctx) => {
    const row = await readSetting(ctx, STORY_AUDIO_KEY);
    return row?.value ?? null;
  },
});

export const setStoryAudio = mutation({
  args: {
    // Either a freshly uploaded file or a direct URL.
    storageId: v.optional(v.id("_storage")),
    url: v.optional(v.string()),
  },
  handler: async (ctx, { storageId, url }) => {
    const resolved = storageId ? await ctx.storage.getUrl(storageId) : url;
    if (!resolved) {
      throw new Error("Provide an audio file or a URL.");
    }

    const existing = await readSetting(ctx, STORY_AUDIO_KEY);
    if (existing) {
      await ctx.db.patch(existing._id, { value: resolved });
    } else {
      await ctx.db.insert("settings", { key: STORY_AUDIO_KEY, value: resolved });
    }
    return resolved;
  },
});

export const clearStoryAudio = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await readSetting(ctx, STORY_AUDIO_KEY);
    if (existing) await ctx.db.delete(existing._id);
    return { cleared: !!existing };
  },
});
