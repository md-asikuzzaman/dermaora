"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface Props {
  name: string;
  images: string[];
  discount: number;
}

const ProductGallery = ({ name, images, discount }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f1eee8]">
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-8"
        />

        {discount > 0 && (
          <span className="absolute left-5 top-5 rounded-full bg-[#315c49] px-4 py-2 text-xs font-medium text-white">
            {discount}% OFF
          </span>
        )}

        <button
          onClick={() => setFavorite(!favorite)}
          aria-label="Toggle wishlist"
          className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm transition hover:text-red-500"
        >
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setSelectedImage(index)}
            aria-label={`View product image ${index + 1}`}
            className={`relative aspect-square overflow-hidden rounded-xl bg-[#f1eee8] transition cursor-pointer ${
              selectedImage === index
                ? "ring-2 ring-[#315c49] ring-offset-2"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <SafeImage
              src={image}
              alt={`${name} ${index + 1}`}
              fill
              sizes="120px"
              className="object-contain p-3"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
