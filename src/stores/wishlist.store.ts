import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { WishlistItem, WishlistProductInput } from "@/types/store.types";

interface WishlistStore {
  items: WishlistItem[];
  hasHydrated: boolean;

  addItem: (product: WishlistProductInput) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: WishlistProductInput) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  setHasHydrated: (value: boolean) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      // Add product
      addItem: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);

          if (exists) return state;

          return {
            items: [...state.items, product],
          };
        });
      },

      // Remove product
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      // Toggle product
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);

        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      // Check product
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      // Clear wishlist
      clearWishlist: () => {
        set({ items: [] });
      },

      // Hydration
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "dermaora-wishlist",
      storage: createJSONStorage(() => localStorage),
      version: 1,

      partialize: (state) => ({
        items: state.items,
      }),

      skipHydration: true,

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Wishlist hydration failed:", error);
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);
