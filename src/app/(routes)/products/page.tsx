import ProductListing from "@/components/filters/ProductListing";
import { Suspense } from "react";

export default function ProductPage() {
  return (
    <main className="container mx-auto space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Shop Skincare</h1>
        <p className="mt-2 text-muted-foreground">
          Discover the perfect skincare products for your skin.
        </p>
      </div>

      <Suspense fallback={<>Loading</>}>
        <ProductListing />
      </Suspense>
    </main>
  );
}
