import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";

const reviews = [
  {
    id: 1,
    name: "Sarah Ahmed",
    rating: 5,
    date: "October 12, 2026",
    comment:
      "Absolutely love this essence! My skin feels hydrated and soft. The texture is lightweight and absorbs quickly.",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    rating: 4,
    date: "October 08, 2026",
    comment:
      "Really good product. It keeps my skin moisturized throughout the day. Definitely worth trying.",
  },
  {
    id: 3,
    name: "Ayesha Rahman",
    rating: 5,
    date: "September 28, 2026",
    comment:
      "This has become an essential part of my skincare routine. Very happy with the results.",
  },
];

const ratingStats = [
  { stars: 5, percentage: 75 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 7 },
  { stars: 2, percentage: 2 },
  { stars: 1, percentage: 1 },
];

interface Props {
  rating: number;
  totalReviews: number;
}

const ProductReviews = ({ rating, totalReviews }: Props) => {
  return (
    <section className="mt-20 border-t border-neutral-200 pt-12">
      <div className="mb-9">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#718b76]">
          Customer Feedback
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-[#26372e] md:text-3xl">
          Customer Reviews
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Real experiences and feedback from our customers.
        </p>
      </div>

      {/* Rating Overview */}
      <div className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-6 md:grid-cols-[220px_1fr] md:p-8">
        <div className="flex flex-col items-center justify-center border-b border-neutral-200 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <span className="text-5xl font-semibold text-[#26372e]">
            {rating.toFixed(1)}
          </span>

          <div className="mt-3 flex gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={17} fill="currentColor" />
            ))}
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {ratingStats.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-8 text-sm text-neutral-600">
                {item.stars} ★
              </span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-[#718b76]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right text-xs text-neutral-400">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-[#26372e]">
          Customer Feedback ({reviews.length})
        </h3>

        <div className="mt-5 divide-y divide-neutral-200">
          {reviews.map((review) => (
            <article key={review.id} className="py-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-[#26372e]">
                    {review.name}
                  </h4>

                  <div className="mt-2 flex gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <span className="text-xs text-neutral-400">{review.date}</span>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Review Form */}
      <div className="mt-12">
        <ReviewForm />
      </div>
    </section>
  );
};

export default ProductReviews;
