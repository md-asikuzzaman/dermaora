"use client";

import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ProductFilters from "@/components/filters/ProductFilters";
import ProductToolbar from "./ProductToolbar";
import ProductGrid from "./ProductGrid";

import { getProducts } from "@/services/product.service";

export default function ProductListing() {
  const searchParams = useSearchParams();

  // URL is the source of truth for filters
  // Pagination is managed separately
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");

  const filterQueryString = params.toString();

  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPlaceholderData,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", filterQueryString],

    initialPageParam: 1,

    queryFn: ({ pageParam }) => {
      const queryParams = new URLSearchParams(filterQueryString);
      queryParams.set("page", String(pageParam));

      return getProducts(queryParams);
    },

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },

    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  // Combine products from all fetched pages
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const total = data?.pages[0]?.meta.total ?? 0;

  // Keep previous price boundaries during filter refetch
  const minPrice = data?.pages[0]?.meta.minPrice ?? 0;
  const maxPrice = data?.pages[0]?.meta.maxPrice ?? 10000;

  const isUpdating = isFetching && !isFetchingNextPage;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
      {/* Desktop Filters */}
      <aside className="hidden lg:block">
        <ProductFilters minPrice={minPrice} maxPrice={maxPrice} />
      </aside>

      <section className="min-w-0 space-y-6">
        {/* Mobile Filters */}
        <div className="flex justify-end lg:hidden">
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" className="gap-2" />}
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[85%] overflow-y-auto sm:max-w-sm"
            >
              <SheetHeader>
                <SheetTitle>Product Filters</SheetTitle>
              </SheetHeader>

              <div className="mt-6">
                <ProductFilters minPrice={minPrice} maxPrice={maxPrice} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Toolbar */}
        <ProductToolbar total={total} isFetching={isFetching} />

        {/* Initial Loading */}
        {isPending ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError && !data ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4">
            <p className="text-sm text-destructive">Failed to load products.</p>

            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Products */}
            <div className="relative">
              {isUpdating && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs shadow-sm">
                    <Loader2 className="size-3 animate-spin" />
                    Updating products...
                  </div>
                </div>
              )}

              <div
                className={`transition-opacity duration-200 ${
                  isUpdating ? "opacity-50" : "opacity-100"
                }`}
              >
                <ProductGrid products={products} />
              </div>
            </div>

            {/* Load More */}
            {hasNextPage && (
              <div className="flex flex-col items-center gap-3 pt-6">
                {isFetchNextPageError && (
                  <p className="text-sm text-destructive">
                    Failed to load more products.
                  </p>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  disabled={isFetchingNextPage || isPlaceholderData}
                  onClick={() => fetchNextPage()}
                  className="min-w-40 gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Loading...
                    </>
                  ) : isFetchNextPageError ? (
                    "Try again"
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
