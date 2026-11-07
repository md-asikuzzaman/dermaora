import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing the application",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={<div className="p-4">Loading sidebar...</div>}>
        <AdminSidebar />
      </Suspense>

      <main className="w-full">
        {/* <SidebarTrigger /> */}
        <div className="p-2 md:p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
