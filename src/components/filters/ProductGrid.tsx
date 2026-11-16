import { PackageSearch } from "lucide-react";
import ProductCard from "../ProductCard";
import { Product } from "@prisma/client";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
          <PackageSearch className="size-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold">No products found</h3>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We couldnt find any products matching your filters. Try adjusting your
          search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
