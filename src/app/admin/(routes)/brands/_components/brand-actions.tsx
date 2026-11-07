"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  DialogFooter,
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

import { deleteBrand, updateBrand } from "@/services/brand.service";

import {
  updateBrandSchema,
  type UpdateBrandInput,
} from "@/schema/brand.schema";
import { GalleryImageField } from "@/components/gallery/gallery-image-field";

type BrandActionsProps = {
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    isActive: boolean;
  };
};

export function BrandActions({ brand }: BrandActionsProps) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateBrandInput>({
    resolver: zodResolver(updateBrandSchema),
    defaultValues: {
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo ?? "",
      isActive: brand.isActive,
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

  const slug = useWatch({
    control,
    name: "slug",
  });

  const isActive = useWatch({
    control,
    name: "isActive",
  });

  const handleNameChange = (value: string) => {
    setValue("name", value, { shouldValidate: true });

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (values: UpdateBrandInput) => {
    try {
      await updateBrand(brand.id, {
        ...values,
        name: values.name?.trim(),
        slug: values.slug?.trim(),
        logo: values.logo?.trim() || null,
      });

      toast.success("Brand updated successfully");

      setEditOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update brand",
      );
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteBrand(brand.id);

      toast.success("Brand deleted successfully");

      setDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete brand",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setEditOpen(open);

    if (open) {
      reset({
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo ?? "",
        isActive: brand.isActive,
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Edit Brand */}
      <Dialog open={editOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Edit brand">
              <Pencil className="size-4" />
            </Button>
          }
        />

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
              <DialogDescription>
                Update your brand information.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-5">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor={`name-${brand.id}`}>Brand Name</Label>

                <Input
                  id={`name-${brand.id}`}
                  placeholder="CeraVe"
                  {...register("name", {
                    onChange: (event) => handleNameChange(event.target.value),
                  })}
                  disabled={isSubmitting}
                />

                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="grid gap-2">
                <Label htmlFor={`slug-${brand.id}`}>Brand Slug</Label>

                <Input
                  id={`slug-${brand.id}`}
                  placeholder="cerave"
                  {...register("slug")}
                  disabled={isSubmitting}
                />

                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Your brand URL: /{slug || "your-brand"}
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
                    isEdit
                  />
                )}
              />

              {/* Status */}
              <div className="grid gap-2">
                <Label>Status</Label>

                <Select
                  value={isActive ? "ACTIVE" : "INACTIVE"}
                  onValueChange={(value) =>
                    setValue("isActive", value === "ACTIVE", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {errors.isActive && (
                  <p className="text-sm text-destructive">
                    {errors.isActive.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Brand */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              size="icon"
              aria-label="Delete brand"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this brand?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete {brand.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
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
