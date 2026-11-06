import type { Category } from "@prisma/client";
import { getBaseUrl, handleResponse } from "./api-utils";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/schema/category.schema";

/** Get all categories */
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${getBaseUrl()}/api/categories`, {
    cache: "no-store",
  });

  return handleResponse<Category[]>(response);
}

/** Create category */
export async function createCategory(
  data: CreateCategoryInput,
): Promise<Category> {
  const response = await fetch(`${getBaseUrl()}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Category>(response);
}

/** Update category */
export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> {
  const response = await fetch(
    `${getBaseUrl()}/api/categories/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse<Category>(response);
}

/** Delete category */
export async function deleteCategory(id: string): Promise<Category> {
  const response = await fetch(
    `${getBaseUrl()}/api/categories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<Category>(response);
}
