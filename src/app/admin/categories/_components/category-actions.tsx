"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import type { Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
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

import {
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category.service";

import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "@/schema/category.schema";

type CategoryActionsProps = {
  category: Category;
};

export function CategoryActions({ category }: CategoryActionsProps) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
      parentId: category.parentId ?? null,
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

  useEffect(() => {
    if (!editOpen) return;

    getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));
  }, [editOpen]);

  const handleNameChange = (value: string) => {
    setValue("name", value, { shouldValidate: true });

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (values: UpdateCategoryInput) => {
    if (values.parentId === category.id) {
      toast.error("A category cannot be its own parent");
      return;
    }

    try {
      await updateCategory(category.id, {
        ...values,
        description: values.description?.trim() || null,
        image: values.image?.trim() || null,
        parentId: values.parentId || null,
      });

      toast.success("Category updated successfully");

      setEditOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category",
      );
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteCategory(category.id);

      toast.success("Category deleted successfully");

      setDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setEditOpen(open);

    if (open) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        image: category.image ?? "",
        parentId: category.parentId ?? null,
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Edit Category */}
      <Dialog open={editOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Edit category">
              <Pencil className="size-4" />
            </Button>
          }
        />

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update your category information.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-5">
              {/* Category Name */}
              <div className="grid gap-2">
                <Label htmlFor={`name-${category.id}`}>Category Name</Label>

                <Input
                  id={`name-${category.id}`}
                  placeholder="Skincare"
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

              {/* Category Slug */}
              <div className="grid gap-2">
                <Label htmlFor={`slug-${category.id}`}>Category Slug</Label>

                <Input
                  id={`slug-${category.id}`}
                  placeholder="skincare"
                  {...register("slug")}
                  disabled={isSubmitting}
                />

                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Category URL: /{slug || "your-category"}
                </p>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor={`description-${category.id}`}>
                  Description
                </Label>

                <Textarea
                  id={`description-${category.id}`}
                  placeholder="Enter category description..."
                  {...register("description")}
                  disabled={isSubmitting}
                />

                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div className="grid gap-2">
                <Label htmlFor={`image-${category.id}`}>Image URL</Label>

                <Input
                  id={`image-${category.id}`}
                  placeholder="https://example.com/image.jpg"
                  {...register("image")}
                  disabled={isSubmitting}
                />

                {errors.image && (
                  <p className="text-sm text-destructive">
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Parent Category */}
              <div className="grid gap-2">
                <Label>Parent Category</Label>

                <Controller
                  control={control}
                  name="parentId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? null : value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select parent category">
                          {field.value
                            ? categories.find((item) => item.id === field.value)
                                ?.name
                            : "No parent category"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="none">No parent category</SelectItem>

                        {categories
                          .filter((item) => item.id !== category.id)
                          .map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.parentId && (
                  <p className="text-sm text-destructive">
                    {errors.parentId.message}
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

      {/* Delete Category */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              size="icon"
              aria-label="Delete category"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete {category.name}? This action
              cannot be undone.
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
