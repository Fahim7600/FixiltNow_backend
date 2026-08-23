import { z } from "zod";

export const servicesQuerySchema = z.object({
  categoryId: z.string().uuid("Invalid category ID format").optional(),
  search: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0, "minPrice cannot be negative").optional(),
  maxPrice: z.coerce.number().min(0, "maxPrice cannot be negative").optional(),
  location: z.string().trim().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest"])
    .optional()
    .default("newest"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export const techniciansQuerySchema = z.object({
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  skills: z.string().trim().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export type ServicesQueryInput = z.infer<typeof servicesQuerySchema>;
export type TechniciansQueryInput = z.infer<typeof techniciansQuerySchema>;
