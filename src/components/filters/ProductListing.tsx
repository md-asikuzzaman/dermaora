"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import ProductFilters from "@/components/filters/ProductFilters";
import ProductToolbar from "./ProductToolbar";
import ProductGrid from "./ProductGrid";

import { getProducts } from "@/services/product.service";

export default function ProductListing() {
  const searchParams = useSearchParams();

  // Remove page from filters query.
  // Pagination is managed by useInfiniteQuery.
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

    staleTime: 30 * 1000,
  });

  // Combine products from all fetched pages.
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const total = data?.pages[0]?.meta.total ?? 0;

  const filters = (
    <ProductFilters
      minPrice={data?.pages[0]?.meta.minPrice ?? 0}
      maxPrice={data?.pages[0]?.meta.maxPrice ?? 0}
    />
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
      {/* Desktop Filters */}
      <aside className="hidden lg:block">{filters}</aside>

      <section className="min-w-0 space-y-6">
        {/* Mobile Filter Button */}
        <div className="flex justify-end lg:hidden">
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="sm" className="gap-2" />}
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

              <div className="mt-6">{filters}</div>
            </SheetContent>
          </Sheet>
        </div>

        <ProductToolbar total={total} isFetching={isFetching} />

        {isPending ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : isError && products.length === 0 ? (
          <div className="space-y-3 py-16 text-center">
            <p className="text-sm text-destructive">Failed to load products.</p>

            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Products */}
            <div className="relative">
              {isFetching && !isFetchingNextPage && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <div className="rounded-full border bg-background px-3 py-1.5 text-xs shadow-sm">
                    Updating products...
                  </div>
                </div>
              )}

              <div
                className={`transition-opacity duration-200 ${
                  isFetching && !isFetchingNextPage
                    ? "opacity-50"
                    : "opacity-100"
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
                  disabled={isFetchingNextPage}
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
