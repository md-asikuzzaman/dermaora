"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteProduct, updateProduct } from "@/services/product.service";
import { updateProductSchema } from "@/schema/product.schema";
import { Product } from "@prisma/client";

type ProductFormValues = z.input<typeof updateProductSchema>;
type ProductPayload = z.output<typeof updateProductSchema>;

type Option = {
  id: string;
  name: string;
};

type ProductActionsProps = {
  product: Omit<Product, "createdAt" | "updatedAt">;
  brands: Option[];
  categories: Option[];
};

export function ProductActions({
  product,
  brands,
  categories,
}: ProductActionsProps) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imagesText, setImagesText] = useState(product.images.join("\n"));
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ProductFormValues, unknown, ProductPayload>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description ?? "",
      shortDescription: product.shortDescription ?? "",
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      images: product.images,
      thumbnail: product.thumbnail ?? "",
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      brandId: product.brandId,
      categoryId: product.categoryId,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const brandId = useWatch({ control, name: "brandId" });
  const categoryId = useWatch({ control, name: "categoryId" });
  const isFeatured = useWatch({ control, name: "isFeatured" });
  const isActive = useWatch({ control, name: "isActive" });

  const resetForm = () => {
    reset({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description ?? "",
      shortDescription: product.shortDescription ?? "",
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      images: product.images,
      thumbnail: product.thumbnail ?? "",
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      brandId: product.brandId,
      categoryId: product.categoryId,
    });

    setImagesText(product.images.join("\n"));
  };

  const handleNameChange = (value: string) => {
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setValue("slug", generatedSlug, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleEdit = async (values: ProductPayload) => {
    try {
      const images = imagesText
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean);

      await updateProduct(product.id, {
        ...values,
        description: values.description?.trim() || null,
        shortDescription: values.shortDescription?.trim() || null,
        thumbnail: values.thumbnail?.trim() || null,
        images,
      });

      toast.success("Product updated successfully.");

      setEditOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteProduct(product.id);

      toast.success("Product deleted successfully.");

      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (open) {
            resetForm();
          }
        }}
      >
        <DialogTrigger
          render={
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter product name"
                  {...register("name", {
                    onChange: (event) => handleNameChange(event.target.value),
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  placeholder="product-slug"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  placeholder="Enter product SKU"
                  {...register("sku")}
                />
                {errors.sku && (
                  <p className="text-sm text-destructive">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-salePrice">Sale Price</Label>
                <Input
                  id="edit-salePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("salePrice", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                />
                {errors.salePrice && (
                  <p className="text-sm text-destructive">
                    {errors.salePrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={brandId ?? ""}
                  onValueChange={(value) =>
                    setValue("brandId", value ?? "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand">
                      {brands.find((brand) => brand.id === brandId)?.name}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brandId && (
                  <p className="text-sm text-destructive">
                    {errors.brandId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={categoryId ?? ""}
                  onValueChange={(value) =>
                    setValue("categoryId", value ?? "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category">
                      {
                        categories.find(
                          (category) => category.id === categoryId,
                        )?.name
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-shortDescription">Short Description</Label>
              <Textarea
                id="edit-shortDescription"
                placeholder="Enter short description"
                {...register("shortDescription")}
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter product description"
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
              <Input
                id="edit-thumbnail"
                placeholder="https://example.com/thumbnail.jpg"
                {...register("thumbnail")}
              />
              {errors.thumbnail && (
                <p className="text-sm text-destructive">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-images">Product Images</Label>
              <Textarea
                id="edit-images"
                value={imagesText}
                onChange={(event) => setImagesText(event.target.value)}
                placeholder="Enter image URLs, one per line"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Add one image URL per line.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-isFeatured"
                  checked={!!isFeatured}
                  onCheckedChange={(checked) =>
                    setValue("isFeatured", checked === true, {
                      shouldDirty: true,
                    })
                  }
                />
                <Label htmlFor="edit-isFeatured">Featured Product</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-isActive"
                  checked={!!isActive}
                  onCheckedChange={(checked) =>
                    setValue("isActive", checked === true, {
                      shouldDirty: true,
                    })
                  }
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{product.name}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
