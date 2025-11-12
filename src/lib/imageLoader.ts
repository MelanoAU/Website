// /lib/imageLoader.ts
export const imageLoader = ({ src }: { src: string }) => {
  // 外链直接返回
  if (/^https?:\/\//i.test(src)) return src;

  // 读取 basePath（例如 /Website）
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  // 允许传入 "images/x.webp" 或 "/images/x.webp"
  const path = src.startsWith('/') ? src : `/${src}`;

  return `${base}/Website${path}`;
};
