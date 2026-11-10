import type { Product } from "@prisma/client";
import axios from "axios";

export const fetchBestSellers = async (): Promise<Product[]> => {
  try {
    const { data } = await axios.get<ApiResponse<Product[]>>("/api/products");

    return data.data ?? [];
  } catch (error) {
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }

    throw new Error("Failed to fetch best seller products.");
  }
};
