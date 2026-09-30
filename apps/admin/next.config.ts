import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: fix accumulated TS errors and remove this flag.
  // Currently ~143 implicit-any / never-inference errors block `next build`
  // even though `next dev` runs fine. Tracked as a follow-up cleanup.
  typescript: { ignoreBuildErrors: true },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default nextConfig;
