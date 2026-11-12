import { Suspense } from "react";
import { getCategories } from "@/services/category.service";
import CategoriesList from "./_components/CategoriesList";
import SectionHeader from "../../../components/AnimatedHeader";
import Container from "@/components/Container";

const CategoriesPage = () => {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <SectionHeader
          title="Explore Our Categories"
          description="Discover a wide range of skincare categories to find the perfect products for your beauty routine."
        />
        <Suspense fallback={<p>Loading...</p>}>
          <CategoriesContent />
        </Suspense>
      </Container>
    </main>
  );
};

async function CategoriesContent() {
  const categories = await getCategories();

  return <CategoriesList categories={categories} />;
}

export default CategoriesPage;
