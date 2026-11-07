import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Suspense } from "react";
import { getCategories } from "@/services/category.service";
import { CreateCategoryDialog } from "./_components/create-category-dialog";
import { CategoryActions } from "./_components/category-actions";

export default function Categories() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryRenderer />
    </Suspense>
  );
}

async function CategoryRenderer() {
  const categories = await getCategories();

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>

          <p className="text-sm text-muted-foreground">
            Manage your product categories.
          </p>
        </div>

        <CreateCategoryDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>

                  <TableCell className="text-muted-foreground">
                    /{category.slug}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {category.parentId
                      ? (categoryMap.get(category.parentId) ?? "Unknown")
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <CategoryActions category={category} />
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
