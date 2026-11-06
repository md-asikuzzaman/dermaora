import { z } from "zod";

const productBaseSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Product slug is required")
    .transform((value) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .pipe(z.string().min(1, "Invalid product slug")),

  sku: z.string().trim().min(1, "Product SKU is required"),

  description: z.string().trim().nullable().optional(),

  shortDescription: z.string().trim().nullable().optional(),

  price: z.number().finite().positive("Price must be a positive number"),

  salePrice: z
    .number()
    .finite()
    .nonnegative("Sale price cannot be negative")
    .nullable()
    .optional(),

  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),

  images: z.array(z.string()).optional(),

  thumbnail: z.string().trim().nullable().optional(),

  isFeatured: z.boolean().optional(),

  isActive: z.boolean().optional(),

  brandId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid brand ID"),

  categoryId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category ID"),
});

export const createProductSchema = productBaseSchema.refine(
  (data) => data.salePrice == null || data.salePrice < data.price,
  {
    message: "Sale price must be lower than price",
    path: ["salePrice"],
  },
);

export const updateProductSchema = productBaseSchema
  .partial()
  .refine(
    (data) =>
      data.salePrice == null ||
      data.price === undefined ||
      data.salePrice < data.price,
    {
      message: "Sale price must be lower than price",
      path: ["salePrice"],
    },
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
