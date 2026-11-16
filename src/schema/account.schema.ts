import { z } from "zod";

export const updateAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must not exceed 50 characters."),

  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(value),
      "Please enter a valid phone number.",
    ),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
