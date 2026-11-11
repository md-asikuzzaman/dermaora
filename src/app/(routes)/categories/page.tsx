import { Suspense } from "react";
import { getCategories } from "@/services/category.service";
import CategoriesList from "./_components/CategoriesList";

const CategoriesPage = () => {
  return (
    <main className="container mx-auto px-4 py-16">
      <Suspense fallback={<p>Loading...</p>}>
        <CategoriesContent />
      </Suspense>
    </main>
  );
};

async function CategoriesContent() {
  const categories = await getCategories();

  return <CategoriesList categories={categories} />;
}

export default CategoriesPage;
