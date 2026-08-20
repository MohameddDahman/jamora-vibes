import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only hosts we actually serve images from. A wildcard here would let
    // anyone proxy arbitrary images through the site's image optimiser and
    // bill the bandwidth to this account.
    remotePatterns: [
      // Admin uploads. Wildcarded because each Convex deployment gets its own
      // subdomain, so dev and production differ.
      { protocol: "https", hostname: "*.convex.cloud" },

      // Seed and stock imagery.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },

      // Two early test products still point at supplier sites. These can be
      // removed once those rows carry uploaded images instead.
      { protocol: "https", hostname: "future.com.eg" },
      { protocol: "https", hostname: "media.guitarcenter.com" },
    ],
  },
};

export default nextConfig;
