import { Suspense } from "react";
import { getBrands } from "@/services/brand.service";
import BrandsList from "./_components/BrandsList";

export default function BrandsPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Suspense fallback={<p>Loading...</p>}>
        <BrandsContent />
      </Suspense>
    </main>
  );
}

const BrandsContent = async () => {
  const brands = await getBrands();

  return <BrandsList brands={brands} />;
};
