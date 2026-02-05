import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/types', '@repo/ui'],
  devIndicators: false,
};

export default nextConfig;
