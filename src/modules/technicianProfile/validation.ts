import { z } from "zod";

export const upsertProfileSchema = z.object({
  bio: z.string().trim().optional(),
  skills: z.array(z.string().trim()).optional().default([]),
  experienceYears: z
    .number({ message: "Experience years must be a number" })
    .min(0, "Experience years cannot be negative")
    .optional()
    .default(0),
  hourlyRate: z
    .number({ message: "Hourly rate must be a positive number" })
    .gt(0, "Hourly rate must be a positive number"),
});

export type UpsertProfileInput = z.infer<typeof upsertProfileSchema>;
