import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing the application",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="p-2 md:p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
