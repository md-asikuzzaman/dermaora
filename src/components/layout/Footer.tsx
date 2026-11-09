"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Heart } from "lucide-react";

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      {/* Newsletter */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row lg:px-8">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              A Little Glow in Your Inbox
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Subscribe for skincare tips, exclusive offers, and new arrivals.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md items-center gap-2 rounded-full border border-input bg-background p-1.5"
          >
            <Mail className="ml-3 size-5 shrink-0 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-5">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-[0.12em] text-foreground">
              DERMAORA
            </span>
            <span className="mt-1 block text-center text-[9px] tracking-[0.35em] text-muted-foreground">
              SKINCARE & BEAUTY
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            Discover the beauty of healthy skin. We bring you carefully selected
            skincare essentials to help you feel confident in your natural glow.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { icon: FaInstagram, href: "#", label: "Instagram" },
              { icon: FaFacebook, href: "#", label: "Facebook" },
              { icon: FaTwitter, href: "#", label: "Twitter" },
              { icon: FaYoutube, href: "#", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon size={17} strokeWidth={1.7} />
              </Link>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
            Explore
          </h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link
                href="/products"
                className="transition-colors hover:text-foreground"
              >
                Shop All
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className="transition-colors hover:text-foreground"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/brands"
                className="transition-colors hover:text-foreground"
              >
                Popular Brands
              </Link>
            </li>
            <li>
              <Link
                href="/products?sort=newest"
                className="transition-colors hover:text-foreground"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/products?sort=popular"
                className="transition-colors hover:text-foreground"
              >
                Best Sellers
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
            Customer Care
          </h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-foreground"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="transition-colors hover:text-foreground"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/shipping"
                className="transition-colors hover:text-foreground"
              >
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                className="transition-colors hover:text-foreground"
              >
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link
                href="/track-order"
                className="transition-colors hover:text-foreground"
              >
                Track Your Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
            Get in Touch
          </h3>

          <ul className="space-y-5 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-foreground" />
              <a
                href="mailto:support@dermaora.com"
                className="transition-colors hover:text-foreground"
              >
                support@dermaora.com
              </a>
            </li>

            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-foreground" />
              <a
                href="tel:+8801000000000"
                className="transition-colors hover:text-foreground"
              >
                +880 1000-000000
              </a>
            </li>

            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-foreground" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dermaora. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/refund-policy"
              className="transition-colors hover:text-foreground"
            >
              Refund Policy
            </Link>
          </div>

          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with{" "}
            <Heart size={13} className="fill-current text-destructive" /> for
            your skin.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
