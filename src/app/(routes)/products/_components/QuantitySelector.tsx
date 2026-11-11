"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  quantity: number;
  setQuantity: (quantity: number) => void;
  maxQuantity: number;
}

const QuantitySelector = ({ quantity, setQuantity, maxQuantity }: Props) => {
  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-medium text-neutral-800">Quantity</p>

      <div className="flex h-12 w-fit items-center rounded-lg border border-neutral-200 bg-white">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="flex size-12 items-center justify-center text-neutral-600 hover:text-[#315c49] disabled:opacity-40"
        >
          <Minus size={16} />
        </button>

        <span className="w-10 text-center text-sm font-medium">{quantity}</span>

        <button
          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
          aria-label="Increase quantity"
          className="flex size-12 items-center justify-center text-neutral-600 hover:text-[#315c49] disabled:opacity-40"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
