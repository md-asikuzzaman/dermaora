"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ImagePlus, Plus, X } from "lucide-react";

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

import { GalleryPicker } from "@/components/gallery/gallery-picker";

import { createBrand } from "@/services/brand.service";
import { createBrandSchema } from "@/schema/brand.schema";

type BrandFormValues = z.input<typeof createBrandSchema>;
type BrandPayload = z.output<typeof createBrandSchema>;

export function CreateBrandDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

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

  const slug = useWatch({
    control,
    name: "slug",
  });

  const logo = useWatch({
    control,
    name: "logo",
  });

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

  const handleRemoveLogo = () => {
    setValue("logo", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            reset();
            setGalleryOpen(false);
          }
        }}
      >
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
              {/* Name */}
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

              {/* Slug */}
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
                  Your brand URL: /{slug || "your-brand"}
                </p>
              </div>

              {/* Logo */}
              <div className="grid gap-2">
                <Label>Brand Logo</Label>

                {logo ? (
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                      <img
                        src={logo}
                        alt="Brand logo"
                        className="size-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Logo selected</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {logo}
                      </p>

                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto px-0"
                        onClick={() => setGalleryOpen(true)}
                        disabled={isSubmitting}
                      >
                        Change logo
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={handleRemoveLogo}
                      disabled={isSubmitting}
                      aria-label="Remove logo"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    disabled={isSubmitting}
                    className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-center transition-colors hover:border-primary hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <ImagePlus className="size-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Choose brand logo</p>
                      <p className="text-xs text-muted-foreground">
                        Select an image from your media library
                      </p>
                    </div>
                  </button>
                )}

                {errors.logo && (
                  <p className="text-xs text-destructive">
                    {errors.logo.message}
                  </p>
                )}
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

      {/* Gallery Picker */}
      <GalleryPicker
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        mode="single"
        onSelect={(images) => {
          const selectedImage = images[0];

          if (!selectedImage) return;

          setValue("logo", selectedImage.imageUrl, {
            shouldValidate: true,
            shouldDirty: true,
          });

          setGalleryOpen(false);
        }}
      />
    </>
  );
}
