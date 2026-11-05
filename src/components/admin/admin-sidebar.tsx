"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Store,
  ShoppingCart,
  Users,
  Star,
  Stethoscope,
  Images,
  FileText,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Store Management",
    items: [
      { title: "Products", url: "/admin/products", icon: ShoppingBag },
      { title: "Categories", url: "/admin/categories", icon: Tags },
      { title: "Brands", url: "/admin/brands", icon: Store },
      { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
      { title: "Customers", url: "/admin/customers", icon: Users },
      { title: "Reviews", url: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Content & Services",
    items: [
      {
        title: "Consultations",
        url: "/admin/consultations",
        icon: Stethoscope,
      },
      { title: "Gallery", url: "/admin/gallery", icon: Images },
      { title: "Pages", url: "/admin/pages", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", url: "/admin/settings", icon: Settings }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ShoppingBag className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">BeautyCare</span>
                <span className="truncate text-xs">Admin Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.url ||
                        pathname.startsWith(`${item.url}/`);

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Visit website"
            >
              <ShoppingBag />
              <span>Visit Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
