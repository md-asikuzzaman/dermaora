import ProductBreadcrumb from "../_components/ProductBreadcrumb";
import ProductGallery from "../_components/ProductGallery";
import ProductInfo from "../_components/ProductInfo";
import ProductReviews from "../_components/ProductReviews";
import ProductTabs from "../_components/ProductTabs";
import { product } from "../_components/test";

const ProductDetailsPage = () => {
  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#fcfbf8]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-14">
        <ProductBreadcrumb
          category={product.category}
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

        <ProductReviews
          rating={product.rating}
          totalReviews={product.reviews}
        />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
