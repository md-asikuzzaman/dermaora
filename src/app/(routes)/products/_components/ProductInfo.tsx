"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ProductDetails } from "@/types/product-details.prisma";

import ProductActions from "./ProductActions";
import ProductBenefits from "./ProductBenefits";
import ProductPrice from "./ProductPrice";
import QuantitySelector from "./QuantitySelector";

import { useCartStore } from "@/stores/cart.store";

interface Props {
  product: ProductDetails;
}

const ProductInfo = ({ product }: Props) => {
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;

  const cartProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price,
    salePrice: product.salePrice,
    thumbnail: product.thumbnail,
    stock: product.stock,
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem(cartProduct, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem(cartProduct, quantity);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col pt-2">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#718b76]">
        {product.brand.name}
      </p>

      <h1 className="mt-3 text-2xl font-semibold leading-tight text-[#26372e] md:text-4xl">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} fill="currentColor" />
          ))}
        </div>

        <span className="text-sm font-medium text-neutral-700">
          {product.rating}
        </span>

        <span className="text-sm text-neutral-400">
          ({product.reviews?.length ?? 0} Reviews)
        </span>
      </div>

      {/* Price */}
      <ProductPrice
        price={product.salePrice ?? product.price}
        oldPrice={product.price}
      />

      <div className="my-7 h-px bg-neutral-200" />

      {/* Description */}
      <p className="text-sm leading-7 text-neutral-600">
        {product.description}
      </p>

      {/* Stock */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        <span
          className={`size-2 rounded-full ${
            isOutOfStock ? "bg-red-500" : "bg-green-500"
          }`}
        />

        <span
          className={`font-medium ${
            isOutOfStock ? "text-red-600" : "text-green-700"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>

        {!isOutOfStock && (
          <span className="text-neutral-400">— {product.stock} available</span>
        )}
      </div>

      {/* Quantity */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        maxQuantity={product.stock}
      />

      {/* Actions */}
      <ProductActions
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        disabled={isOutOfStock}
      />

      {/* Benefits */}
      <ProductBenefits />

      <p className="mt-5 text-xs leading-6 text-neutral-400">
        Free delivery eligibility and return conditions are subject to store
        policy.
      </p>
    </div>
  );
};

export default ProductInfo;
