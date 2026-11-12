"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Heart } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

import SafeImage from "../SafeImage";
import Container from "../Container";

// ---------------------------------------------
// Footer Data
// ---------------------------------------------

const SOCIAL_LINKS = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Shop All", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Popular Brands", href: "/brands" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Best Sellers", href: "/products?sort=popular" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Your Order", href: "/track-order" },
    ],
  },
];

const CONTACT_INFO = [
  {
    icon: Mail,
    content: "support@dermaora.com",
    href: "mailto:support@dermaora.com",
  },
  {
    icon: Phone,
    content: "+880 1000-000000",
    href: "tel:+8801000000000",
  },
  {
    icon: MapPin,
    content: "Dhaka, Bangladesh",
    href: null,
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const BRAND_INFO = {
  logo: "/images/logo.png",
  name: "Dermaora",
  description:
    "Discover the beauty of healthy skin. We bring you carefully selected skincare essentials to help you feel confident in your natural glow.",
  email: "support@dermaora.com",
  copyright: `© ${new Date().getFullYear()} Dermaora. All rights reserved.`,
};

// ---------------------------------------------
// Footer Component
// ---------------------------------------------

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      {/* Main Footer */}
      <Container className="grid grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-5">
          <Link href="/" className="inline-block w-30 md:w-35 lg:w-45">
            <SafeImage
              src={BRAND_INFO.logo}
              alt={`${BRAND_INFO.name} Logo`}
              width={800}
              height={400}
              className="h-auto w-full object-contain"
            />
          </Link>

          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            {BRAND_INFO.description}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon size={17} />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        {FOOTER_LINKS.map(({ title, links }) => (
          <div key={title}>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              {title}
            </h3>

            <ul className="space-y-4 text-sm text-muted-foreground">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
            Get in Touch
          </h3>

          <ul className="space-y-5 text-sm text-muted-foreground">
            {CONTACT_INFO.map(({ icon: Icon, content, href }) => (
              <li key={content} className="flex items-start gap-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-foreground" />

                {href ? (
                  <a
                    href={href}
                    className="transition-colors hover:text-foreground"
                  >
                    {content}
                  </a>
                ) : (
                  <span>{content}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row lg:px-8">
          <p className="text-xs text-muted-foreground">
            {BRAND_INFO.copyright}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>

          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with
            <Heart size={13} className="fill-current text-destructive" />
            for your skin.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
