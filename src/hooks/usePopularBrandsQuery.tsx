import { fetchPopularBrands } from "@/services/popular-brands.service";
import { useQuery } from "@tanstack/react-query";

export const popularBrandsKeys = {
  all: ["popular-brands"] as const,
};

export const usePopularBrandsQuery = () => {
  return useQuery({
    queryKey: popularBrandsKeys.all,
    queryFn: fetchPopularBrands,
    staleTime: 5 * 60 * 1000,
  });
};
