import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SafeImage from "@/components/SafeImage";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

import { CreateProductDialog } from "./_components/create-product-dialog";
import { PaginationControls } from "./_components/pagination-controls";
import { ProductActions } from "./_components/product-actions";

type ProductsProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const PAGE_SIZE = 10;

export default function Products({ searchParams }: ProductsProps) {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductRenderer searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductRenderer({ searchParams }: ProductsProps) {
  const params = await searchParams;

  // Validate page number
  const parsedPage = Number(params.page);

  const requestedPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  // Fetch products, brands and categories
  const [result, brands, categories] = await Promise.all([
    getProducts(requestedPage, PAGE_SIZE),
    getBrands(),
    getCategories(),
  ]);

  // Extract products and metadata
  const { data: products, meta } = result;

  const { total, page, limit, totalPages } = meta;

  // Create lookup maps
  const brandMap = new Map(brands.map(({ id, name }) => [id, name]));

  const categoryMap = new Map(categories.map(({ id, name }) => [id, name]));

  // Dialog options
  const brandOptions = brands.map(({ id, name }) => ({
    id,
    name,
  }));

  const categoryOptions = categories.map(({ id, name }) => ({
    id,
    name,
  }));

  // Pagination information
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Products Table */}
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
                    <SafeImage
                      src={product.thumbnail as string}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="mr-2 inline-block size-10 rounded-md object-cover"
                    />

                    {product.name}

                    {product.isFeatured && (
                      <Badge variant="secondary" className="ml-2">
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

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startItem}–{endItem} of {total} products
          </p>

          {totalPages > 1 && (
            <PaginationControls page={page} totalPages={totalPages} />
          )}
        </div>
      )}
    </div>
  );
}
