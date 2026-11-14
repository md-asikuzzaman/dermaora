"use client";

import { useCartStore } from "@/stores/cart.store";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

const CheckoutContent = () => {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground animate-pulse">
          Loading checkout...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="size-9 text-muted-foreground" />
        </div>

        <h2 className="text-xl font-semibold">Your cart is empty</h2>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You need to add some products to your cart before proceeding to
          checkout.
        </p>

        <Link
          href="/products"
          className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return <CheckoutForm />;
};

export default CheckoutContent;
