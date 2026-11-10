"use client";

import { fetchBestSellers } from "@/services/best-seller.service";
import { useQuery } from "@tanstack/react-query";

export const bestSellerKeys = {
  all: ["best-sellers"] as const,
};

export const useBestSellerQuery = () => {
  return useQuery({
    queryKey: bestSellerKeys.all,
    queryFn: fetchBestSellers,
    staleTime: 5 * 60 * 1000,
  });
};
