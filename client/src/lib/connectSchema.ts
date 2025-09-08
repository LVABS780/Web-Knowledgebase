import { z } from "zod";

export const letsConnectCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits")
    .optional(),
  services: z.array(z.string().min(1, "Service cannot be empty")).min(1, {
    message: "At least one service is required",
  }),
});

export type LetsConnectCreateForm = z.infer<typeof letsConnectCreateSchema>;
