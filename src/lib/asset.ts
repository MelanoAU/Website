const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (p: string) => {
  if (/^https?:\/\//i.test(p)) return p;
  return `${base}${p.startsWith('/') ? '' : '/'}${p}`;
};
