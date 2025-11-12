const isProd = process.env.GITHUB_ACTIONS === 'true';
const repo = 'Website';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    loader: 'custom'
  },
  trailingSlash: true,
  assetPrefix: isProd ? `/${repo}/` : '',
  basePath:   isProd ? `/${repo}`   : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : '', // ← 新增
  },
};

module.exports = nextConfig;
