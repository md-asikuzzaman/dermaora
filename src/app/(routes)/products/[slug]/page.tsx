import { getProductBySlug } from "@/services/product.service";
import ProductBreadcrumb from "../_components/ProductBreadcrumb";
import ProductGallery from "../_components/ProductGallery";
import ProductInfo from "../_components/ProductInfo";
import ProductReviews from "../_components/ProductReviews";
import ProductTabs from "../_components/ProductTabs";
import { Suspense } from "react";

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

export const ProductDetailsRenderer = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const discount =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.salePrice - product.price) / product.price) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#fcfbf8]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-14">
        <ProductBreadcrumb category={""} productName={product.name} />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            name={product.name}
            images={product.images}
            discount={discount}
          />

          <ProductInfo product={product} />
        </div>

        {/* <ProductTabs product={product} /> */}

        {/* <ProductReviews
          rating={product.rating}
          totalReviews={product.reviews}
        /> */}
      </div>
    </main>
  );
};
