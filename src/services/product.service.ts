import type { Product } from "@prisma/client";
import { getBaseUrl, handleResponse } from "./api-utils";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/schema/product.schema";

/** Get all products */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${getBaseUrl()}/api/products`, {
    cache: "no-store",
  });

  return handleResponse<Product[]>(response);
}

/** Create product */
export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  const response = await fetch(`${getBaseUrl()}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Product>(response);
}

/** Update product */
export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<Product> {
  const response = await fetch(
    `${getBaseUrl()}/api/products/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse<Product>(response);
}

/** Delete product */
export async function deleteProduct(id: string): Promise<Product> {
  const response = await fetch(
    `${getBaseUrl()}/api/products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<Product>(response);
}
