import type { Category } from "@prisma/client";
import axios from "axios";

export const fetchTopCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await axios.get<ApiResponse<Category[]>>(
      "/api/categories/featured",
    );
    return data?.data || [];
  } catch (error) {
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }

    throw new Error("Failed to fetch popular brands.");
  }
};
