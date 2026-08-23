import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED"], {
    message: "Status must be either ACTIVE or BANNED",
  }),
});

export const adminUsersQuerySchema = z.object({
  role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "BANNED"]).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 1))
    .refine((val) => val >= 1, "Page must be at least 1"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 50, "Limit must be between 1 and 50"),
});

export const adminBookingsQuerySchema = z.object({
  status: z
    .enum([
      "REQUESTED",
      "ACCEPTED",
      "DECLINED",
      "PAID",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 1))
    .refine((val) => val >= 1, "Page must be at least 1"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 50, "Limit must be between 1 and 50"),
});

export const adminPaymentsQuerySchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 1))
    .refine((val) => val >= 1, "Page must be at least 1"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 50, "Limit must be between 1 and 50"),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type AdminUsersQueryInput = z.infer<typeof adminUsersQuerySchema>;
export type AdminBookingsQueryInput = z.infer<typeof adminBookingsQuerySchema>;
export type AdminPaymentsQueryInput = z.infer<typeof adminPaymentsQuerySchema>;
