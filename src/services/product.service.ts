import {
  CreateProductInput,
  UpdateProductInput,
} from "@/schema/product.schema";
import { ProductDetails } from "@/types/product-details.prisma";
import type { Product } from "@prisma/client";
import { getBaseUrl, handleResponse } from "./api-utils";

/** Get all products */
export async function getProducts(
  page = 1,
  limit = 2,
): Promise<ApiResponse<Product[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${getBaseUrl()}/api/products?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  const result: ApiResponse<Product[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

/** Get product by slug */
export async function getProductBySlug(slug: string): Promise<ProductDetails> {
  const response = await fetch(
    `${getBaseUrl()}/api/products/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  return handleResponse<ProductDetails>(response);
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
