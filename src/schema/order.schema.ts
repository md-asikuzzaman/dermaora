import { z } from "zod";

export const createOrderSchema = z.object({
  paymentMethod: z.enum(["COD", "STRIPE"]),

  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),

        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "Your cart is empty"),

  shippingAddress: z.object({
    fullName: z.string().trim().min(2, "Full name is required"),
    phone: z.string().trim().min(10, "Valid phone number is required"),
    email: z.union([z.string().trim().email(), z.literal("")]).optional(),
    address: z.string().trim().min(5, "Address is required"),
    city: z.string().trim().min(2, "City is required"),
    district: z.string().trim().min(2, "District is required"),
    postalCode: z.string().trim().optional(),
    note: z.string().trim().optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(1, "Order number is required"),
});
