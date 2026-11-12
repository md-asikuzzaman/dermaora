"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Trash2 } from "lucide-react";

import type { WishlistItem } from "@/types/store.types";
import { useWishlistStore } from "@/stores/wishlist.store";

interface WishlistCardProps {
  item: WishlistItem;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

const WishlistCard = ({ item }: WishlistCardProps) => {
  const removeItem = useWishlistStore((state) => state.removeItem);

  const hasDiscount =
    item.salePrice !== null &&
    item.salePrice >= 0 &&
    item.salePrice < item.price;

  const currentPrice = hasDiscount ? item.salePrice! : item.price;

  const discount = hasDiscount
    ? Math.round(((item.price - currentPrice) / item.price) * 100)
    : 0;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        aria-label={`View ${item.name}`}
        className="relative block aspect-[4/4.2] overflow-hidden bg-muted/40"
      >
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Heart size={42} className="text-muted-foreground/30" />
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Remove Wishlist */}
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.name} from wishlist`}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-destructive hover:text-white"
      >
        <Trash2 size={16} />
      </button>

      {/* Product Information */}
      <div className="space-y-2 p-3 sm:p-4">
        <Link
          href={`/products/${item.slug}`}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground transition-colors hover:text-primary sm:text-base"
        >
          {item.name}
        </Link>

        {/* Rating */}
        {item.rating !== null && (
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-foreground">
              {item.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-base font-bold text-foreground sm:text-lg">
            {formatPrice(currentPrice)}
          </span>

          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
