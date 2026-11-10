"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { GalleryImageField } from "@/components/gallery/gallery-image-field";
import { Checkbox } from "@/components/ui/checkbox";
import { createBrandSchema } from "@/schema/brand.schema";
import { createBrand } from "@/services/brand.service";
import { Textarea } from "@/components/ui/textarea";

type BrandFormValues = z.input<typeof createBrandSchema>;
type BrandPayload = z.output<typeof createBrandSchema>;

export function CreateBrandDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues, unknown, BrandPayload>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logo: "",
      website: "",
      isFeatured: false,
      isActive: true,
    },
  });

  const onSubmit = async (values: BrandPayload) => {
    try {
      await createBrand({
        ...values,
      });

      toast.success("Brand created successfully");

      setOpen(false);
      reset();
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create brand",
      );
    }
  };

  const handleDialogChange = (value: boolean) => {
    setOpen(value);

    if (!value && !isSubmitting) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Create Brand
          </Button>
        }
      />

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <DialogDescription>
              Create a new brand for your products.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            {/* Brand Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Brand Name</Label>

              <Input
                id="name"
                placeholder="CeraVe"
                {...register("name", {
                  onChange: (event) => {
                    const value = event.target.value;

                    const generatedSlug = value
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "");

                    setValue("slug", generatedSlug, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  },
                })}
                disabled={isSubmitting}
              />

              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Brand Slug */}
            <div className="grid gap-2">
              <Label htmlFor="slug">Brand Slug</Label>

              <Input
                id="slug"
                placeholder="cerave"
                {...register("slug")}
                disabled={isSubmitting}
              />

              {errors.slug && (
                <p className="text-xs text-destructive">
                  {errors.slug.message}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {/* Your brand URL: /{slug || "your-brand"} */}
              </p>
            </div>

            {/* Brand Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                placeholder="Enter brand description..."
                {...register("description")}
                disabled={isSubmitting}
              />

              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Brand Logo */}
            <Controller
              control={control}
              name="logo"
              render={({ field }) => (
                <GalleryImageField
                  label="Brand Logo"
                  mode="single"
                  value={field.value || null}
                  onChange={(value) => field.onChange(value ?? "")}
                />
              )}
            />

            {errors.logo && (
              <p className="text-xs text-destructive">{errors.logo.message}</p>
            )}

            {/* Featured Brand */}
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <Checkbox
                    id="isFeatured"
                    checked={field.value ?? false}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                    }}
                    disabled={isSubmitting}
                  />
                )}
              />

              <div className="grid gap-1">
                <Label htmlFor="isFeatured">Featured Brand</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Brand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
