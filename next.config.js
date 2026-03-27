/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

// GitHub project pages use /repo-name/; set in CI (e.g. BASE_PATH=/Financial-Dashboard-with-Next.js)
const basePath = process.env.BASE_PATH ?? '';

const nextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
      }
    : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: isStaticExport || Boolean(basePath),
  },
};

module.exports = nextConfig;
