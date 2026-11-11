import { Prisma } from "@prisma/client";

export type ProductReviews = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        name: true;
      };
    };
  };
}>;

export type ProductReviewsData = {
  reviews: ProductReviews[];
  summary: {
    averageRating: number;
    totalReviews: number;
    distribution: {
      rating: number;
      count: number;
      percentage: number;
    }[];
  };
};

export type ProductReviewsResponse = ApiResponse<ProductReviewsData> & {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
