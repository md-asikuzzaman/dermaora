"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Review submitted");
      }}
      className="rounded-xl border border-neutral-200 bg-white p-5 md:p-7"
    >
      <h3 className="text-lg font-semibold text-[#26372e]">Write a Review</h3>

      <p className="mt-1 text-sm text-neutral-500">
        Share your experience with this product.
      </p>

      {/* Rating */}
      <div className="mt-6">
        <label className="text-sm font-medium text-neutral-700">
          Your Rating
        </label>

        <div className="mt-3 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${value} out of 5`}
              >
                <Star
                  size={24}
                  className={`transition ${
                    value <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Name & Email */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Your Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            required
            className="h-12 w-full rounded-lg border border-neutral-200 bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#315c49]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            required
            className="h-12 w-full rounded-lg border border-neutral-200 bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#315c49]"
          />
        </div>
      </div>

      {/* Review */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          Your Review
        </label>

        <textarea
          rows={5}
          placeholder="Tell us about your experience..."
          required
          className="w-full resize-none rounded-lg border border-neutral-200 bg-[#fcfbf8] p-4 text-sm outline-none transition focus:border-[#315c49]"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className="mt-5 rounded-lg bg-[#315c49] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#254737] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
