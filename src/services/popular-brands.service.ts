import type { Brand } from "@prisma/client";
import axios from "axios";

export const fetchPopularBrands = async (): Promise<Brand[]> => {
  try {
    const { data } = await axios.get<ApiResponse<Brand[]>>(
      "/api/brands/featured",
    );
    return data.data ?? [];
  } catch (error) {
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      throw new Error(error.response?.data?.message ?? error.message);
    }

    throw new Error("Failed to fetch popular brands.");
  }
};
