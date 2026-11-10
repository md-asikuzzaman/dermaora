import { z } from "zod";

const categoryBaseSchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Category slug is required")
    .transform((value) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .pipe(z.string().min(1, "Invalid category slug")),

  description: z.string().trim().nullable().optional(),

  image: z.string().trim().nullable().optional(),

  parentId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid parent category ID")
    .nullable()
    .optional(),

  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const createCategorySchema = categoryBaseSchema;
export const updateCategorySchema = categoryBaseSchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
