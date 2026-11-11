import { ProductReviewsResponse } from "@/types/product-reviews.prisma";
import { getBaseUrl } from "./api-utils";

/** Get product reviews by slug */
export async function getReviewsBySlug(
  slug: string,
  page = 1,
  limit = 2,
): Promise<ProductReviewsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${getBaseUrl()}/api/products/slug/${encodeURIComponent(slug)}/reviews?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  const result: ProductReviewsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}
