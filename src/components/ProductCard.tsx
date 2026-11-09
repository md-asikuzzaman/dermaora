import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { PLACEHOLDER_IMAGE } from "@/lib/utils";
import { Product } from "@prisma/client";

export default function ProductCard({
  name,
  slug,
  price,
  salePrice,
  stock,
  thumbnail,
  categoryId,
}: Product) {
  //   const { name, slug, price, salePrice, stock, thumbnail, category } = product;

  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < price;

  const discountPercentage = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const displayPrice = hasDiscount ? salePrice : price;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={thumbnail || PLACEHOLDER_IMAGE}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-md bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
              -{discountPercentage}%
            </span>
          )}

          {stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <span className="rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2 p-3 sm:p-4">
        <p className="text-xs text-muted-foreground">{categoryId}</p>

        <Link href={`/products/${slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            ৳{displayPrice.toLocaleString("en-BD")}
          </span>

          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{price.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-medium ${
              stock > 0 ? "text-green-600" : "text-destructive"
            }`}
          >
            {stock > 0 ? "In Stock" : "Unavailable"}
          </span>

          <Link
            href={`/products/${slug}`}
            aria-label={`View ${name}`}
            className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ShoppingBag size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
