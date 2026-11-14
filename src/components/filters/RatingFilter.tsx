"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";

interface RatingFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const ratings = [
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
  { value: "2", label: "2 stars & up" },
];

export default function RatingFilter({ value, onChange }: RatingFilterProps) {
  const selectedRating = value[0] ?? "";

  const toggleRating = (rating: string) => {
    onChange(selectedRating === rating ? "" : rating);
  };

  return (
    <div className="space-y-3">
      {ratings.map((rating) => (
        <label
          key={rating.value}
          className="flex cursor-pointer items-center gap-3"
        >
          <Checkbox
            checked={selectedRating === rating.value}
            onCheckedChange={() => toggleRating(rating.value)}
          />

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`size-3.5 ${
                    index < Number(rating.value)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm">{rating.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
}
