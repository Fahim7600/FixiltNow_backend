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

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
