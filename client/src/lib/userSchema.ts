import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter valid email").optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.enum(["SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"]),
});

export type LoginForm = z.infer<typeof loginSchema>;
