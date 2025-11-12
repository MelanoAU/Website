import React from 'react';
import { asset } from '@/lib/asset';

export function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src = '', ...rest } = props;
  return <img src={src ? asset(String(src)) : undefined} {...rest} />;
}

export function Source(props: React.SourceHTMLAttributes<HTMLSourceElement>) {
  const { src = '', ...rest } = props;
  return <source src={src ? asset(String(src)) : undefined} {...rest} />;
}

export function Video(
  { src, poster, children, ...rest }:
  React.VideoHTMLAttributes<HTMLVideoElement>
) {
  return (
    <video
      src={src ? asset(String(src)) : undefined}
      poster={poster ? asset(String(poster)) : undefined}
      {...rest}
    >
      {React.Children.map(children, (child: any) =>
        child?.type === 'source'
          ? React.cloneElement(child, { src: asset(child.props.src) })
          : child
      )}
    </video>
  );
}
