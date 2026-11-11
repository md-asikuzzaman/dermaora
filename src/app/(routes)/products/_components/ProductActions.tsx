"use client";

import { ShoppingBag } from "lucide-react";

interface Props {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
}

const ProductActions = ({ onAddToCart, onBuyNow, disabled = false }: Props) => {
  return (
    <div className="mt-7 grid grid-cols-2 gap-3">
      <button
        disabled={disabled}
        onClick={onAddToCart}
        className="flex h-13 items-center justify-center gap-2 rounded-lg bg-[#315c49] px-4 text-sm font-medium text-white transition hover:bg-[#254737] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingBag size={18} />
        Add to Cart
      </button>

      <button
        disabled={disabled}
        onClick={onBuyNow}
        className="h-13 rounded-lg border border-[#315c49] px-4 text-sm font-medium text-[#315c49] transition hover:bg-[#315c49] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductActions;
