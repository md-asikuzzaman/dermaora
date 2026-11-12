import { Suspense } from "react";
import { getBrands } from "@/services/brand.service";
import BrandsList from "./_components/BrandsList";
import AnimatedHeader from "@/components/AnimatedHeader";
import Container from "@/components/Container";

export default function BrandsPage() {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <AnimatedHeader
          title="Explore Our Brands"
          description="Discover a wide range of skincare brands to find the perfect products for your beauty routine."
        />
        <Suspense fallback={<p>Loading...</p>}>
          <BrandsContent />
        </Suspense>
      </Container>
    </main>
  );
}

const BrandsContent = async () => {
  const brands = await getBrands();

  return <BrandsList brands={brands} />;
};
