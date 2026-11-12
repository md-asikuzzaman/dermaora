"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";

import Container from "@/components/Container";
import WishlistCard from "@/components/cards/WishlistCard";
import { useWishlistStore } from "@/stores/wishlist.store";

const WishlistsPage = () => {
  const items = useWishlistStore((state) => state.items);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  if (!hasHydrated) {
    return (
      <main className="min-h-[60vh]">
        <Container className="py-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-background">
      <Container className="px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                My Wishlist
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "product" : "products"}{" "}
                saved
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-sm text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Products */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart size={28} className="text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Save your favorite skincare products and find them here whenever
              you need them.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ShoppingBag size={16} />
              Explore Products
            </Link>

            <Link
              href="/"
              className="mt-4 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
};

export default WishlistsPage;
