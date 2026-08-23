import { z } from "zod";

const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one letter and one number",
    ),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Invalid phone number format")
    .optional(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"], {
    message: "Role must be either CUSTOMER or TECHNICIAN",
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
