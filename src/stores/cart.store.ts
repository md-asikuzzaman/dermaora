import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CartProductInput } from "@/types/store.types";

export interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  isOpen: boolean;

  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  setHasHydrated: (value: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const normalizeQuantity = (quantity: number) => {
  if (!Number.isFinite(quantity)) return 1;

  return Math.max(1, Math.floor(quantity));
};

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
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          if (product.stock <= 0) return state;

          const requestedQuantity = normalizeQuantity(quantity);

          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

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

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find((item) => item.id === productId);

          if (!item || !Number.isFinite(quantity)) return state;

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

      clearCart: () => set({ items: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "dermaora-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        items: state.items,
      }),
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

export const selectCartCount = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartStore) =>
  state.items.reduce(
    (total, item) =>
      total + getProductPrice(item.price, item.salePrice) * item.quantity,
    0,
  );
