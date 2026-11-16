"use client";

import { Heart, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense, useState } from "react";

import { selectCartCount, useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

import CartDrawer from "../CartDrawer";
import Container from "../Container";
import SafeImage from "../SafeImage";
import SearchBar from "./SearchBar";

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";

  const openCart = useCartStore((state) => state.openCart);
  const cartCount = useCartStore(selectCartCount);
  const cartHydrated = useCartStore((state) => state.hasHydrated);

  const wishlistCount = useWishlistStore((state) => state.items.length);
  const wishlistHydrated = useWishlistStore((state) => state.hasHydrated);

  const accountHref = "/profile";
  const authHref = isAuthenticated ? accountHref : "/signin";
  const authLabel = isAuthenticated ? "Account" : "Login";

  const mobileNavItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop All" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Shopping Cart" },
    {
      href: authHref,
      label: isAuthenticated ? "My Account" : "Login / Account",
    },
  ];

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
        <Suspense>
          <SearchBar
            mobileOpen={mobileSearchOpen}
            onMobileClose={() => setMobileSearchOpen(false)}
          />
        </Suspense>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen((prev) => !prev);
              setMobileMenu(false);
            }}
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          >
            {mobileSearchOpen ? <X size={22} /> : <Search size={22} />}
          </button>

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

          {/* Dynamic Login / Account */}
          {isSessionLoading ? (
            <div className="hidden h-10 w-24 animate-pulse rounded-full bg-muted sm:block" />
          ) : (
            <Link
              href={authHref}
              className="hidden h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
            >
              <UserRound size={16} />
              {authLabel}
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => {
              setMobileMenu((prev) => !prev);
              setMobileSearchOpen(false);
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm text-foreground">
            {mobileNavItems.map((item) => (
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
