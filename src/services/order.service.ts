import { getBaseUrl, handleResponse } from "./api-utils";
import type { CreateOrderInput } from "@/schema/order.schema";

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: "COD" | "STRIPE";
  paymentStatus: string;
  total: number;
  createdAt: string;
}

/** Create a new order */
export async function createOrder(
  data: CreateOrderInput,
): Promise<CreatedOrder> {
  const response = await fetch(`${getBaseUrl()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(data),
  });

  return handleResponse<CreatedOrder>(response);
}
