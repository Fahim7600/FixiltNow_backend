import { z } from "zod";

export const createServiceSchema = z.object({
  categoryId: z
    .string({ message: "Category ID is required" })
    .uuid("Invalid category ID format"),
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters"),
  description: z.string().trim().optional(),
  price: z
    .number({ message: "Price must be a positive number" })
    .gt(0, "Price must be a positive number"),
});

export const updateServiceSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID format").optional(),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .optional(),
  description: z.string().trim().optional(),
  price: z
    .number({ message: "Price must be a positive number" })
    .gt(0, "Price must be a positive number")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
