import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter valid email").optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.string().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const companyCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter valid email"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  address: z.string().optional(),
});

export type CompanyCreateForm = z.infer<typeof companyCreateSchema>;

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    schema.optional()
  );

export const companyUpdateSchema = z.object({
  companyId: z.string(),
  address: emptyToUndefined(z.string()),
  isActive: z.boolean().optional(),
  name: emptyToUndefined(z.string()),
  email: emptyToUndefined(z.string().email("Please enter valid email")),
  phone: emptyToUndefined(
    z.string().regex(/^\d{10}$/i, "Phone must be 10 digits")
  ),
  password: emptyToUndefined(
    z.string().min(6, "Password must be 6 chars or more")
  ),
});

export type CompanyUpdateForm = z.infer<typeof companyUpdateSchema>;

export const companyDeleteSchema = z.object({
  companyId: z.string().min(1),
});

export type CompanyDeleteForm = z.infer<typeof companyDeleteSchema>;
