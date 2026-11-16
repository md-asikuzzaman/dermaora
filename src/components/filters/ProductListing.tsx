"use client";

import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import ProductFilters from "@/components/filters/ProductFilters";
import ProductToolbar from "./ProductToolbar";
import ProductGrid from "./ProductGrid";

import { getProducts } from "@/services/product.service";

export default function ProductListing() {
  const searchParams = useSearchParams();

  // URL is the source of truth
  const queryString = searchParams.toString();

  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["products", queryString],

    queryFn: () => {
      const params = new URLSearchParams(queryString);
      return getProducts(params);
    },

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000,
  });

  const products = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <ProductFilters
        minPrice={data?.meta.minPrice ?? 0}
        maxPrice={data?.meta.maxPrice ?? 0}
      />

      <section className="min-w-0 space-y-6">
        <ProductToolbar total={total} isFetching={isFetching} />

        {isPending ? (
          <>Pending</>
        ) : isError ? (
          //   <ProductError message={error.message} onRetry={() => refetch()} />
          <>loading</>
        ) : (
          <div className="relative">
            {isFetching && (
              <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                <div className="rounded-full border bg-background px-3 py-1.5 text-xs shadow-sm">
                  Updating products...
                </div>
              </div>
            )}

            <div
              className={`transition-opacity duration-200 ${
                isFetching ? "opacity-50" : "opacity-100"
              }`}
            >
              <ProductGrid products={products} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
