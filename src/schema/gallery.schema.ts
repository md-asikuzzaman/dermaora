import { z } from "zod";

export const gallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  category: z
    .string()
    .trim()
    .max(50, "Category cannot exceed 50 characters")
    .optional(),

  altText: z
    .string()
    .trim()
    .max(150, "Alt text cannot exceed 150 characters")
    .optional(),
});

export type GalleryInput = z.infer<typeof gallerySchema>;
