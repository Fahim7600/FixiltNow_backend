import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createAvailabilitySchema = z
  .object({
    dayOfWeek: z
      .number({ message: "Day of week must be a number" })
      .int("Day of week must be an integer")
      .min(0, "Day of week must be between 0 (Sunday) and 6 (Saturday)")
      .max(6, "Day of week must be between 0 (Sunday) and 6 (Saturday)"),
    startTime: z
      .string({ message: "Start time is required" })
      .regex(timeRegex, "Start time must be in HH:mm format"),
    endTime: z
      .string({ message: "End time is required" })
      .regex(timeRegex, "End time must be in HH:mm format"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
