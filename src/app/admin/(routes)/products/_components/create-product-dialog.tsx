"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

import { createProduct } from "@/services/product.service";
import { createProductSchema } from "@/schema/product.schema";

type ProductFormValues = z.input<typeof createProductSchema>;
type ProductPayload = z.output<typeof createProductSchema>;

type Option = {
  id: string;
  name: string;
};

type CreateProductDialogProps = {
  brands: Option[];
  categories: Option[];
};

export function CreateProductDialog({
  brands,
  categories,
}: CreateProductDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [imagesText, setImagesText] = useState("");

  const form = useForm<ProductFormValues, unknown, ProductPayload>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      description: "",
      shortDescription: "",
      price: 0,
      salePrice: null,
      stock: 0,
      images: [],
      thumbnail: "",
      isFeatured: false,
      isActive: true,
      brandId: "",
      categoryId: "",
    },
  });

  const slug = useWatch({
    control: form.control,
    name: "slug",
  });

  const brandId = useWatch({
    control: form.control,
    name: "brandId",
  });

  const categoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const handleNameChange = (value: string) => {
    form.setValue("name", value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("slug", generatedSlug, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: ProductPayload) => {
    try {
      const images = imagesText
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean);

      await createProduct({
        ...values,
        description: values.description || null,
        shortDescription: values.shortDescription || null,
        thumbnail: values.thumbnail || null,
        salePrice: values.salePrice ?? null,
        images,
      });

      toast.success("Product created successfully.");

      form.reset();
      setImagesText("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your store.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                {...form.register("name")}
                onChange={(event) => handleNameChange(event.target.value)}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="product-slug"
                {...form.register("slug")}
                value={slug ?? ""}
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="Enter product SKU"
                {...form.register("sku")}
              />
              {form.formState.errors.sku && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sku.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...form.register("price", {
                  valueAsNumber: true,
                })}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                {...form.register("salePrice", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
              />
              {form.formState.errors.salePrice && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.salePrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                {...form.register("stock", {
                  valueAsNumber: true,
                })}
              />
              {form.formState.errors.stock && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.stock.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Brand</Label>
              <Select
                value={brandId}
                onValueChange={(value) =>
                  value &&
                  form.setValue("brandId", value, {
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
              {form.formState.errors.brandId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.brandId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId}
                onValueChange={(value) =>
                  value &&
                  form.setValue("categoryId", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category">
                    {
                      categories.find((category) => category.id === categoryId)
                        ?.name
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
              {form.formState.errors.categoryId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              placeholder="Enter short description"
              {...form.register("shortDescription")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              rows={4}
              {...form.register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              placeholder="https://example.com/thumbnail.jpg"
              {...form.register("thumbnail")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <Textarea
              id="images"
              placeholder={"Enter image URLs, one per line"}
              rows={3}
              value={imagesText}
              onChange={(event) => setImagesText(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Add one image URL per line.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isFeatured"
                checked={!!form.getValues("isFeatured")}
                onCheckedChange={(checked) =>
                  form.setValue("isFeatured", checked === true)
                }
              />
              <Label htmlFor="isFeatured">Featured Product</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={!!form.getValues("isActive")}
                onCheckedChange={(checked) =>
                  form.setValue("isActive", checked === true)
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
