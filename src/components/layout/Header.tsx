"use client";

import Link from "next/link";
import { Search, Heart, UserRound, Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";

import SafeImage from "../SafeImage";
import Container from "../Container";
import CartDrawer from "../CartDrawer";

import { selectCartCount, useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

const Header = () => {
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const cartCount = useCartStore(selectCartCount);
  const cartHydrated = useCartStore((state) => state.hasHydrated);

  const wishlistCount = useWishlistStore((state) => state.items.length);
  const wishlistHydrated = useWishlistStore((state) => state.hasHydrated);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (search.trim()) {
    //   window.location.href = `/products?search=${encodeURIComponent(search.trim())}`;
    // }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <Container className="flex h-20 items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="w-16 shrink-0 md:w-18 lg:w-20">
          <SafeImage
            src="/images/logo.png"
            alt="Dermaora Logo"
            width={400}
            height={200}
            className="h-auto w-full object-contain"
          />
        </Link>

        {/* Desktop Search */}
        <div className="hidden max-w-xl flex-1 md:block">
          <form
            onSubmit={handleSearch}
            className="flex h-11 items-center rounded-full border border-input bg-muted/50 px-4 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20"
          >
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for skincare, brands and more..."
              className="w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Heart size={24} strokeWidth={1.6} />

            {wishlistHydrated && wishlistCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Open shopping cart"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ShoppingCart size={24} strokeWidth={1.6} />

            {cartHydrated && cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Login */}
          <Link
            href="/login"
            className="hidden h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
          >
            <UserRound size={16} />
            Login
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Search */}
      <div className="px-4 pb-4 md:hidden">
        <form
          onSubmit={handleSearch}
          className="flex h-11 items-center rounded-full border border-input bg-muted/50 px-4 focus-within:border-ring"
        >
          <Search size={18} className="text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </form>
      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm text-foreground">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop All" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/cart", label: "Shopping Cart" },
              { href: "/login", label: "Login / Account" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Global Cart Drawer */}
      <CartDrawer />
    </header>
  );
};

export default Header;
