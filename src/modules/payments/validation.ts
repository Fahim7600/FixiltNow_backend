import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  bookingId: z
    .string({ message: "Booking ID is required" })
    .uuid("Invalid booking ID format"),
});

export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentSchema
>;
