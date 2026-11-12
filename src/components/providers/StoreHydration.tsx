"use client";

import { useEffect } from "react";

import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

const StoreHydration = () => {
  useEffect(() => {
    void Promise.all([
      useCartStore.persist.rehydrate(),
      useWishlistStore.persist.rehydrate(),
    ]);
  }, []);

  return null;
};

export default StoreHydration;
