"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  getProductPrice,
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "@/stores/cart.store";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

const CartDrawer = () => {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  const cartCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCart();
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-5">
          <SheetTitle className="text-lg font-semibold">
            Your Cart
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({hasHydrated ? cartCount : 0} items)
            </span>
          </SheetTitle>
        </SheetHeader>

        {!hasHydrated ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="mb-4 size-12 text-muted-foreground/50" />

            <h3 className="text-lg font-semibold">Your cart is empty</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {items.map((item) => {
                const currentPrice = getProductPrice(
                  item.price,
                  item.salePrice,
                );

                return (
                  <div key={item.id} className="flex gap-4">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="relative size-24 shrink-0 overflow-hidden rounded-md bg-muted"
                    >
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-muted-foreground transition hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-sm font-semibold">
                        {formatPrice(currentPrice)}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-md border">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="p-2 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="size-3" />
                          </button>

                          <span className="min-w-8 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={item.quantity >= item.stock}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="p-2 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold">
                          {formatPrice(currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 border-t px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>

                <span className="text-lg font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Shipping and taxes are calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Proceed to Checkout
              </Link>

              <p className="text-center text-xs text-muted-foreground">
                Free shipping may be available on eligible orders.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
