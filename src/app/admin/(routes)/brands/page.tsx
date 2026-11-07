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
import { CreateBrandDialog } from "./_components/create-brand-dialog";
import { BrandActions } from "./_components/brand-actions";
import { getBrands } from "@/services/brand.service";

export default function Brands() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandRenderer />
    </Suspense>
  );
}

async function BrandRenderer() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product brands.
          </p>
        </div>

        <CreateBrandDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  No brands found.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>

                  <TableCell className="text-muted-foreground">
                    /{brand.slug}
                  </TableCell>

                  <TableCell>
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(brand.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <BrandActions
                      brand={{
                        id: brand.id,
                        name: brand.name,
                        slug: brand.slug,
                        isActive: brand.isActive,
                        logo: brand.logo,
                      }}
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
