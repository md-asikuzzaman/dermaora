"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

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

import { createBrand } from "@/services/brand.service";
import { createBrandSchema } from "@/schema/brand.schema";
import { GalleryImageField } from "@/components/gallery/gallery-image-field";

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
      isActive: true,
    },
  });

  const handleLogoChange = (value: string | null) => {
    setValue("logo", value ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: BrandPayload) => {
    try {
      await createBrand({
        ...values,
        description: values.description || null,
        logo: values.logo || null,
        website: values.website || null,
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
