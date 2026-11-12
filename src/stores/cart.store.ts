import { CartItem, CartProductInput } from "@/types/store.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;

  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  setHasHydrated: (value: boolean) => void;
}

export const getProductPrice = (price: number, salePrice: number | null) => {
  return salePrice !== null && salePrice >= 0 && salePrice < price
    ? salePrice
    : price;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      // Add product to cart
      addItem: (product, quantity = 1) => {
        set((state) => {
          if (product.stock <= 0) return state;

          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          const requestedQuantity = Math.max(1, Math.floor(quantity));

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...product,
                      quantity: Math.min(
                        item.quantity + requestedQuantity,
                        product.stock,
                      ),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                quantity: Math.min(requestedQuantity, product.stock),
              },
            ],
          };
        });
      },

      // Remove product
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      // Update product quantity
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find((item) => item.id === productId);

          if (!item) return state;

          if (quantity <= 0 || item.stock <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }

          const updatedQuantity = Math.min(Math.floor(quantity), item.stock);

          return {
            items: state.items.map((item) =>
              item.id === productId
                ? { ...item, quantity: updatedQuantity }
                : item,
            ),
          };
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Hydration
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "dermaora-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,

      // Only persist cart items
      partialize: (state) => ({
        items: state.items,
      }),

      // Manual hydration for Next.js
      skipHydration: true,

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Cart hydration failed:", error);
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);

// Selectors
export const selectCartCount = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartStore) =>
  state.items.reduce(
    (total, item) =>
      total + getProductPrice(item.price, item.salePrice) * item.quantity,
    0,
  );
