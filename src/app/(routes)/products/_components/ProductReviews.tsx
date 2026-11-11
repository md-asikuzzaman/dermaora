import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";
import type { ProductReviewsResponse } from "@/types/product-reviews.prisma";

interface Props {
  reviews: ProductReviewsResponse;
}

const ProductReviews = ({ reviews: response }: Props) => {
  const { data, meta } = response;

  const { reviews, summary } = data;

  return (
    <section className="mt-20 border-t border-neutral-200 pt-12">
      <div className="mb-9">
        <h2 className="mt-2 text-2xl font-semibold text-primary md:text-3xl">
          Customer Reviews
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Real experiences and feedback from our customers.
        </p>
      </div>

      {/* Rating Overview */}
      <div className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-6 md:grid-cols-[220px_1fr] md:p-8">
        <div className="flex flex-col items-center justify-center border-b border-neutral-200 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <span className="text-5xl font-semibold text-primary">
            {summary.averageRating.toFixed(1)}
          </span>

          <div className="mt-3 flex gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={17}
                fill={
                  index < Math.round(summary.averageRating)
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Based on {summary.totalReviews} reviews
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const item = summary.distribution.find(
              (item) => item.rating === stars,
            );

            const percentage = item?.percentage ?? 0;

            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-8 text-sm text-neutral-600">{stars} ★</span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-[#718b76]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right text-xs text-neutral-400">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-primary">
          Customer Feedback ({meta.total})
        </h3>

        {reviews.length === 0 ? (
          <p className="mt-5 py-6 text-sm text-neutral-500">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <div className="mt-5 divide-y divide-neutral-200">
            {reviews.map((review) => (
              <article key={review.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-primary">
                      {review.user.name}
                    </h4>

                    <div className="mt-2 flex gap-1 text-amber-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-neutral-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </span>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="mt-12">
        <ReviewForm />
      </div>
    </section>
  );
};

export default ProductReviews;
