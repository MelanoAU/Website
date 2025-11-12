// next.config.js
const isProd = process.env.GITHUB_ACTIONS === 'true';
const repo = 'Website'; // 你的仓库名

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                 // 静态导出，适配 GitHub Pages
  images: { unoptimized: true },    // 关闭 next/image 的优化（GH Pages 无服务端）
  trailingSlash: true,              // 更稳妥的相对路径
  assetPrefix: isProd ? `/${repo}/` : '',
  basePath:   isProd ? `/${repo}`   : '',
};

module.exports = nextConfig;
