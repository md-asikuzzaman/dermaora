"use client";

import { PLACEHOLDER_IMAGE } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallback?: string;
}

export default function SafeImage({
  src,
  alt,
  fallback = PLACEHOLDER_IMAGE,
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
