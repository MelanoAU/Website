const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (p: string) => `${base}${p.startsWith('/') ? '' : '/'}${p}`;
