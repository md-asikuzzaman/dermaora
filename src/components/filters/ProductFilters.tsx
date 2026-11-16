"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";

interface Props {
  minPrice: number;
  maxPrice: number;
}

export default function ProductFilters({ minPrice, maxPrice }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const price: [number, number] = [
    searchParams.has("minPrice")
      ? Number(searchParams.get("minPrice"))
      : minPrice,
    searchParams.has("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : maxPrice,
  ];

  const selectedBrands = searchParams.getAll("brand");
  const selectedCategories = searchParams.getAll("category");
  const rating = searchParams.get("rating") ?? "";
  const search = searchParams.get("search") ?? "";

  // Update URL
  const updateURL = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key);

        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item));
        } else if (value !== null && value !== "") {
          params.set(key, value);
        }
      });

      // Reset pagination whenever filters change
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handlePriceChange = (value: [number, number]) => {
    updateURL({
      minPrice: value[0] > minPrice ? String(value[0]) : null,
      maxPrice: value[1] < maxPrice ? String(value[1]) : null,
    });
  };

  const handleBrandChange = (value: string[]) => {
    updateURL({ brand: value });
  };

  const handleCategoryChange = (value: string[]) => {
    updateURL({ category: value });
  };

  const handleRatingChange = (value: string) => {
    updateURL({ rating: value || null });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    ["brand", "category", "minPrice", "maxPrice", "rating", "search"].forEach(
      (key) => params.delete(key),
    );

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const activeFilters =
    selectedBrands.length +
    selectedCategories.length +
    (rating ? 1 : 0) +
    (search ? 1 : 0) +
    (price[0] > minPrice || price[1] < maxPrice ? 1 : 0);

  return (
    <aside className="w-full space-y-6 rounded-xl border bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" />

          <h2 className="text-lg font-semibold">Filters</h2>

          {activeFilters > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeFilters}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={activeFilters === 0}
          className="h-auto px-2 text-xs text-muted-foreground"
        >
          <X className="mr-1 size-3.5" />
          Clear all
        </Button>
      </div>

      <Separator />

      {/* Price Range */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Price Range</h3>

        <PriceRangeFilter
          key={`${price[0]}-${price[1]}`}
          value={price}
          onChange={handlePriceChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </section>

      <Separator />

      {/* Brand */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Brands</h3>

        <BrandFilter value={selectedBrands} onChange={handleBrandChange} />
      </section>

      <Separator />

      {/* Category */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Categories</h3>

        <CategoryFilter
          value={selectedCategories}
          onChange={handleCategoryChange}
        />
      </section>

      <Separator />

      {/* Rating */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Customer Rating</h3>

        <RatingFilter value={rating} onChange={handleRatingChange} />
      </section>
    </aside>
  );
}
