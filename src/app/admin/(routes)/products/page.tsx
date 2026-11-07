import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Suspense } from "react";

import { getProducts } from "@/services/product.service";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";
import { CreateProductDialog } from "./_components/create-product-dialog";
import { ProductActions } from "./_components/product-actions";

export default function Products() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductRenderer />
    </Suspense>
  );
}

async function ProductRenderer() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  const brandMap = new Map(brands.map((brand) => [brand.id, brand.name]));

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const brandOptions = brands.map(({ id, name }) => ({ id, name }));
  const categoryOptions = categories.map(({ id, name }) => ({ id, name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>

          <p className="text-sm text-muted-foreground">
            Manage your store products.
          </p>
        </div>

        <CreateProductDialog
          brands={brandOptions}
          categories={categoryOptions}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                    {product.isFeatured && (
                      <Badge variant="outline" className="ml-2">
                        Featured
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {product.sku}
                  </TableCell>

                  <TableCell>
                    {brandMap.get(product.brandId) ?? "Unknown"}
                  </TableCell>

                  <TableCell>
                    {categoryMap.get(product.categoryId) ?? "Unknown"}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {product.salePrice != null ? (
                        <>
                          <p className="font-medium">
                            ৳{product.salePrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            ৳{product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p>৳{product.price.toFixed(2)}</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{product.stock}</TableCell>

                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <ProductActions
                      product={product}
                      brands={brandOptions}
                      categories={categoryOptions}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
