import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/services/product.service";
import { getReviewsBySlug } from "@/services/review.service";

import ProductBreadcrumb from "../_components/ProductBreadcrumb";
import ProductGallery from "../_components/ProductGallery";
import ProductInfo from "../_components/ProductInfo";
import ProductReviews from "../_components/ProductReviews";
import ProductTabs from "../_components/ProductTabs";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductDetailsRenderer params={params} />
    </Suspense>
  );
}

async function ProductDetailsRenderer({ params }: Props) {
  const { slug } = await params;

  let product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const discount =
    product.salePrice !== null && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#fcfbf8]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-14">
        <ProductBreadcrumb
          category={product.category.name}
          productName={product.name}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            name={product.name}
            images={product.images}
            discount={discount}
          />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />

        <Suspense fallback={<p>Loading...</p>}>
          <ProductReviewsRenderer slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}

async function ProductReviewsRenderer({ slug }: { slug: string }) {
  const reviews = await getReviewsBySlug(slug);
  return <ProductReviews reviews={reviews} />;
}
