import {
  CreateProductInput,
  UpdateProductInput,
} from "@/schema/product.schema";
import { ProductDetails } from "@/types/product-details.prisma";
import type { Product } from "@prisma/client";
import { getBaseUrl, handleResponse } from "./api-utils";

/** Get all products */
export interface ProductFilterValues {
  minPrice: number;
  maxPrice: number;
  brand: string[];
  category: string[];
  rating: string[];
  sort: string;
}

/** Get all products */
export async function getProducts(params: URLSearchParams): Promise<ApiResponse<Product[]>> {
  const query = new URLSearchParams();

  // Pagination
  query.set("page", params.get("page") || "1");
  query.set("limit", params.get("limit") || "12");

  // Search
  const search = params.get("search");
  if (search) query.set("search", search);

  // Price range
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  if (minPrice) query.set("minPrice", minPrice);
  if (maxPrice) query.set("maxPrice", maxPrice);

  // Brand slugs
  params.getAll("brand").forEach((slug) => {
    query.append("brand", slug);
  });

  // Category slugs
  params.getAll("category").forEach((slug) => {
    query.append("category", slug);
  });

  // Ratings
  params.getAll("rating").forEach((rating) => {
    query.append("rating", rating);
  });

  // Sorting
  const sort = params.get("sort");
  if (sort) query.set("sort", sort);

  const url = `${getBaseUrl()}/api/products?${query.toString()}`;

  console.log("Product API URL:", url);

  const response = await fetch(url, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch products");
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
