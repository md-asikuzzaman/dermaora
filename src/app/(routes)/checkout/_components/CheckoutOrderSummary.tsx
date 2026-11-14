import Image from "next/image";
import type { CartItem } from "@/types/store.types";
import { getProductPrice } from "@/stores/cart.store";
import { Separator } from "@/components/ui/separator";

interface Props {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const CheckoutOrderSummary = ({ items, subtotal, deliveryFee }: Props) => {
  const total = subtotal + deliveryFee;

  return (
    <section className="rounded-2xl border p-5 sm:p-7">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Review your selected products.
      </p>

      {/* Products */}
      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const price = getProductPrice(item.price, item.salePrice);

          return (
            <div key={item.id} className="flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}

                <span className="absolute -right-0 -top-0 flex size-6 items-center justify-center rounded-bl-lg bg-primary text-xs font-medium text-primary-foreground">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {formatPrice(price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="my-6" />

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>

        <span className="text-xl font-bold">{formatPrice(total)}</span>
      </div>

      <p className="mt-5 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
        Final pricing and product availability will be verified by our server
        when your order is placed.
      </p>
    </section>
  );
};

export default CheckoutOrderSummary;
