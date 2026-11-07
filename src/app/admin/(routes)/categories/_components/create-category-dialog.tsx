"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

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

import { createCategory, getCategories } from "@/services/category.service";

import {
  CreateCategoryInput,
  createCategorySchema,
} from "@/schema/category.schema";
import type { Category } from "@prisma/client";

export function CreateCategoryDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: null,
      image: null,
      parentId: null,
    },
  });

  const slug = useWatch({
    control,
    name: "slug",
  });

  const parentId = useWatch({
    control,
    name: "parentId",
  });

  useEffect(() => {
    if (!open) return;

    getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));
  }, [open]);

  const onSubmit = async (values: CreateCategoryInput) => {
    try {
      await createCategory(values);

      toast.success("Category created successfully");

      setOpen(false);
      reset();

      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Create Category
          </Button>
        }
      />

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Create a new category for your products.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>

              <Input
                id="name"
                placeholder="Skincare"
                {...register("name", {
                  onChange: (event) => {
                    const value = event.target.value;

                    setValue(
                      "slug",
                      value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    );
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
              <Label htmlFor="slug">Category Slug</Label>

              <Input
                id="slug"
                placeholder="skincare"
                {...register("slug")}
                disabled={isSubmitting}
              />

              <p className="text-xs text-muted-foreground">
                Category URL: /{slug || "your-category"}
              </p>

              {errors.slug && (
                <p className="text-xs text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                placeholder="Enter category description..."
                {...register("description")}
                disabled={isSubmitting}
              />

              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>

              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
                disabled={isSubmitting}
              />

              {errors.image && (
                <p className="text-xs text-destructive">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Parent Category */}
            <div className="grid gap-2">
              <Label>Parent Category</Label>
              <Select
                value={parentId ?? "none"}
                onValueChange={(value) =>
                  setValue("parentId", value === "none" ? null : value, {
                    shouldValidate: true,
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select parent category">
                    {parentId
                      ? categories.find((category) => category.id === parentId)
                          ?.name
                      : "No parent category"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">No parent category</SelectItem>

                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.parentId && (
                <p className="text-xs text-destructive">
                  {errors.parentId.message}
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
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
