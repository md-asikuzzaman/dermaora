import { z } from "zod";

const brandBaseSchema = z.object({
  name: z.string().trim().min(1, "Brand name is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Brand slug is required")
    .transform((value) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .pipe(z.string().min(1, "Invalid brand slug")),

  description: z.string().trim().nullable().optional(),

  logo: z.string().trim().nullable().optional(),

  website: z.string().trim().nullable().optional(),
});

export const createBrandSchema = brandBaseSchema;
export const updateBrandSchema = brandBaseSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
