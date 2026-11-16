"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, Package, Heart, MapPin, Menu } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    label: "Orders",
    href: "/order",
    icon: Package,
  },
  {
    label: "Wishlist",
    href: "/wishlists",
    icon: Heart,
  },
  {
    label: "Addresses",
    href: "/addresses",
    icon: MapPin,
  },
  {
    label: "More",
    href: "/settings",
    icon: Menu,
  },
];

export default function AccountBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/settings" && pathname.startsWith("/settings"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-transform",
                  isActive && "scale-110",
                )}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
