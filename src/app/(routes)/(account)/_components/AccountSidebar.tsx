"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserRound,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { label: "My Profile", href: "/profile", icon: UserRound },
  { label: "My Orders", href: "/order", icon: Package },
  { label: "My Wishlist", href: "/wishlists", icon: Heart },
  { label: "My Addresses", href: "/addresses", icon: MapPin },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  const { data: session } = useSession();

  console.log(session?.user.id);



  





  return (
    <aside className="hidden h-fit rounded-2xl border bg-white p-5 shadow-sm lg:block">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            AS
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Welcome back!</p>
          <p className="truncate text-xs text-muted-foreground">
            asik@example.com
          </p>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-5" />

      {/* Sign Out */}
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
        onClick={() => signOut({ callbackUrl: "/sigin" })}
      >
        <LogOut className="size-4" />
        Sign Out
      </button>
    </aside>
  );
}
