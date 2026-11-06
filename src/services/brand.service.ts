import { CreateBrandInput, UpdateBrandInput } from "@/schema/brand.schema";
import type { Brand } from "@prisma/client";
import { getBaseUrl, handleResponse } from "./api-utils";

/** Get all brands */
export async function getBrands(): Promise<Brand[]> {
  const response = await fetch(`${getBaseUrl()}/api/brands`, {
    cache: "no-store",
  });

  return handleResponse<Brand[]>(response);
}

/** Create brand */
export async function createBrand(data: CreateBrandInput): Promise<Brand> {
  const response = await fetch(`${getBaseUrl()}/api/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Brand>(response);
}

/** Update brand */
export async function updateBrand(
  id: string,
  data: UpdateBrandInput,
): Promise<Brand> {
  const response = await fetch(
    `${getBaseUrl()}/api/brands/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse<Brand>(response);
}

/** Delete brand */
export async function deleteBrand(id: string): Promise<Brand> {
  const response = await fetch(
    `${getBaseUrl()}/api/brands/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<Brand>(response);
}
