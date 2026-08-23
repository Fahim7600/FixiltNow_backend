import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z
    .string({ message: "Service ID is required" })
    .uuid("Invalid service ID format"),
  scheduledDate: z
    .string({ message: "Scheduled date is required" })
    .datetime({ message: "Invalid ISO date format" })
    .refine((val) => new Date(val) > new Date(), {
      message: "Scheduled date must be a future date",
    }),
  notes: z.string().trim().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"], {
    message:
      "Invalid status. Allowed statuses are ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED",
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
