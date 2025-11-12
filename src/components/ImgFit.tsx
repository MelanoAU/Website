import React from 'react';
import { asset } from '@/lib/asset';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;              // 形如 "/images/xxx.webp" 或 "images/xxx.webp"
  mode?: 'contain' | 'cover';
};

export default function ImgFit({ src, alt = '', mode = 'contain', className = '', ...rest }: Props) {
  // 归一化到 /images/... 开头
  const normalized = /^https?:\/\//i.test(src)
    ? src
    : src.startsWith('/') ? src : `/${src}`;

  return (
    <img
      src={asset(normalized)}
      alt={alt}
      className={`absolute inset-0 w-full h-full object-${mode} ${className}`}
      {...rest}
    />
  );
}
