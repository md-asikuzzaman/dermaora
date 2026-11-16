"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getProducts } from "@/services/product.service";
import SafeImage from "../SafeImage";

interface SearchFormProps {
  mobile?: boolean;
  onMobileClose?: () => void;
}

export default function SearchForm({
  mobile = false,
  onMobileClose,
}: SearchFormProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  // Fetch suggestions
  const { data, isFetching, isError } = useQuery({
    queryKey: ["product-search-suggestions", debouncedSearch],

    queryFn: () => {
      const params = new URLSearchParams();
      params.set("search", debouncedSearch);

      return getProducts(params);
    },

    enabled: debouncedSearch.length >= 2,
    staleTime: 30_000,
  });

  const products = data?.data ?? [];

  // Show dropdown only when focused
  const showDropdown = isFocused && search.trim().length >= 2;

  // Clear search input
  const handleClear = () => {
    setSearch("");
    setDebouncedSearch("");
  };

  // Submit search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const searchValue = search.trim();

    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }

    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");

    setIsFocused(false);

    router.push(`/products?${params.toString()}`, {
      scroll: false,
    });

    onMobileClose?.();
  };

  // Navigate to product details
  const handleProductClick = (slug: string) => {
    setSearch("");
    setDebouncedSearch("");
    setIsFocused(false);

    onMobileClose?.();

    router.push(`/products/${slug}`);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <form
        onSubmit={handleSearch}
        className={`flex items-center rounded-full border border-input bg-muted/50 px-4 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 ${
          mobile ? "h-12" : "h-11"
        }`}
      >
        <Search size={18} className="shrink-0 text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for skincare, brands and more..."
          className="w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />

        {/* Clear Search */}
        {search && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Search Suggestions */}
      {showDropdown && (
        <div className="absolute left-0 top-full z-[60] mt-2 w-full overflow-hidden rounded-xl border bg-background shadow-lg">
          {isFetching ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Searching products...
            </p>
          ) : isError ? (
            <p className="p-4 text-center text-sm text-destructive">
              Failed to load products.
            </p>
          ) : products.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {products.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product.slug)}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <SafeImage
                        src={product.thumbnail as string}
                        alt={product.name}
                        className="size-full object-cover"
                        height={50}
                        width={50}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {product.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        ৳{product.salePrice ?? product.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  searchRef.current?.querySelector("form")?.requestSubmit();
                }}
                className="w-full border-t p-3 text-center text-sm font-medium text-primary transition-colors hover:bg-muted"
              >
                View all results
              </button>
            </>
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
