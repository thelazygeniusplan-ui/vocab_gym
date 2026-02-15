import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/station-a',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://gather.town',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://gather.town https://app.gather.town",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
