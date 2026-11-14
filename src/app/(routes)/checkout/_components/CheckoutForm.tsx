"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { selectCartSubtotal, useCartStore } from "@/stores/cart.store";

import {
  CheckoutFormInput,
  checkoutFormSchema,
  type CreateOrderInput,
} from "@/schema/order.schema";

import { createOrder, type CreatedOrder } from "@/services/order.service";

import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutSuccess from "./CheckoutSuccess";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CheckoutForm = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectCartSubtotal);

  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [serverError, setServerError] = useState("");

  // Keep synchronized with backend delivery policy.
  const deliveryFee = 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      paymentMethod: "COD",
      shippingAddress: {
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
        note: "",
      },
    },
  });

  const onSubmit = async (values: CheckoutFormInput) => {
    setServerError("");

    if (items.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    try {
      const payload: CreateOrderInput = {
        ...values,
        paymentMethod: "COD",
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await createOrder(payload);

      setOrder(createdOrder);
      clearCart();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };
  if (order) {
    return <CheckoutSuccess order={order} />;
  }

  return (
    <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Checkout Form */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-7"
          noValidate
        >
          {/* Contact Information */}
          <section className="rounded-2xl border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserRound className="size-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Contact Information</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Provide your contact details for order updates.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>

                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  disabled={isSubmitting}
                  {...register("shippingAddress.fullName")}
                />

                {errors.shippingAddress?.fullName && (
                  <p className="text-xs text-destructive">
                    {errors.shippingAddress.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone and Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    maxLength={20}
                    disabled={isSubmitting}
                    {...register("shippingAddress.phone")}
                  />

                  {errors.shippingAddress?.phone && (
                    <p className="text-xs text-destructive">
                      {errors.shippingAddress.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...register("shippingAddress.email")}
                  />

                  {errors.shippingAddress?.email && (
                    <p className="text-xs text-destructive">
                      {errors.shippingAddress.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-2xl border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="size-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Shipping Address</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your complete delivery address.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Street Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>

                <Textarea
                  id="address"
                  placeholder="House, road, area, landmark..."
                  rows={3}
                  maxLength={500}
                  disabled={isSubmitting}
                  {...register("shippingAddress.address")}
                />

                {errors.shippingAddress?.address && (
                  <p className="text-xs text-destructive">
                    {errors.shippingAddress.address.message}
                  </p>
                )}
              </div>

              {/* City and District */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City / Area *</Label>

                  <Input
                    id="city"
                    placeholder="e.g. Dhaka"
                    maxLength={100}
                    disabled={isSubmitting}
                    {...register("shippingAddress.city")}
                  />

                  {errors.shippingAddress?.city && (
                    <p className="text-xs text-destructive">
                      {errors.shippingAddress.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>

                  <Input
                    id="district"
                    placeholder="e.g. Dhaka"
                    maxLength={100}
                    disabled={isSubmitting}
                    {...register("shippingAddress.district")}
                  />

                  {errors.shippingAddress?.district && (
                    <p className="text-xs text-destructive">
                      {errors.shippingAddress.district.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code (Optional)</Label>

                <Input
                  id="postalCode"
                  placeholder="e.g. 1207"
                  maxLength={20}
                  disabled={isSubmitting}
                  {...register("shippingAddress.postalCode")}
                />
              </div>

              {/* Order Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Order Note (Optional)</Label>

                <Textarea
                  id="note"
                  placeholder="Any special delivery instructions?"
                  rows={3}
                  maxLength={500}
                  disabled={isSubmitting}
                  {...register("shippingAddress.note")}
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-2xl border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Truck className="size-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Payment Method</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select your preferred payment method.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-primary bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center rounded-full border-2 border-primary">
                  <div className="size-2.5 rounded-full bg-primary" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">Cash on Delivery</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Pay when your order arrives at your doorstep.
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Available
                </span>
              </div>
            </div>
          </section>

          {/* Server Error */}
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          {/* Submit Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="h-12 w-full rounded-full text-sm font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Placing Your Order...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Your information is securely processed.</span>
            </div>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
          />
        </div>
      </aside>
    </div>
  );
};

export default CheckoutForm;
