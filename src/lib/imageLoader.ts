// /lib/imageLoader.ts
export const imageLoader = ({ src }: { src: string }) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''; // 例如 /Website
  if (/^https?:\/\//i.test(src)) return src;            // 外链不加前缀
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};
