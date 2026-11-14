import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
  };
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const CheckoutSuccess = ({ order }: Props) => {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border p-6 text-center sm:p-10">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle2 className="size-11 text-green-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold">Order Placed Successfully!</h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Thank you for shopping with Dermaora. Your order has been received and
        will be processed shortly.
      </p>

      <div className="mt-8 rounded-xl bg-secondary/60 p-5 text-left">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Order Number</span>
          <span className="break-all text-right text-sm font-semibold">
            {order.orderNumber}
          </span>
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment Method</span>
          <span className="text-sm font-medium">Cash on Delivery</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Order Status</span>
          <span className="text-sm font-medium">{order.status}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="text-lg font-bold">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border p-4 text-left">
        <Package className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Please keep your phone available. Our team may contact you to confirm
          your delivery details.
        </p>
      </div>

      <Button className="mt-8 h-12 w-full rounded-full">
        <Link href="/products">
          Continue Shopping
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
    </div>
  );
};

export default CheckoutSuccess;
