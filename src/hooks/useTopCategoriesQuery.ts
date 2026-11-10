import { fetchTopCategories } from "@/services/top-categories.service";
import { useQuery } from "@tanstack/react-query";

export const featuredCategoryKeys = {
  all: ["featured-categories"] as const,
};

export const useTopCategoriesQuery = () => {
  return useQuery({
    queryKey: featuredCategoryKeys.all,
    queryFn: fetchTopCategories,
    staleTime: 5 * 60 * 1000,
  });
};
