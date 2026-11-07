"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallback?: string;
}

const FALLBACK_IMAGE = "/images/placeholder.png";

export default function SafeImage({
  src,
  alt,
  fallback = FALLBACK_IMAGE,
  ...rest
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError || !src ? fallback : src;

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt={alt || "Image"}
      onError={() => {
        if (!hasError && imageSrc !== fallback) {
          setHasError(true);
        }
      }}
    />
  );
}
