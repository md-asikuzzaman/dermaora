import type { ReactNode } from "react";
import AccountSidebar from "./_components/AccountSidebar";
import AccountBottomNav from "./_components/AccountBottomNav";
import Container from "@/components/Container";

interface Props {
  children: ReactNode;
}

export default async function UserLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Container className="py-6 pb-16 sm:px-6 lg:py-12 lg:pb-12">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and orders.
          </p>
        </div>

        {/* Account Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <AccountSidebar />

          <section className="min-w-0">{children}</section>
        </div>
      </Container>

      {/* Mobile Bottom Navigation */}
      <AccountBottomNav />
    </main>
  );
}
