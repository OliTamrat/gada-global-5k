import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Friendly paths for print. The site canonical stays the homepage — these are
  // 308s, not duplicate pages, so a flyer can carry gadaglobalrun.com/5k-peace-run
  // without splitting the page's search identity.
  async redirects() {
    return [
      { source: "/5k-peace-run", destination: "/", permanent: true },
      { source: "/peace-run", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
