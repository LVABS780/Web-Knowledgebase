import { z } from "zod";

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    schema.optional()
  );

export const sectionSchema = z.object({
  subtitle: z.string().optional(),
  description: z.string().optional(),
});

export const resourceCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sections: z.array(sectionSchema).optional(),
});

export type ResourceCreateForm = z.infer<typeof resourceCreateSchema>;

export const resourceUpdateSchema = z.object({
  resourceId: z.string(),
  title: emptyToUndefined(z.string().min(1, "Title is required")),
  description: emptyToUndefined(z.string().min(1, "Description is required")),
  sections: z.array(sectionSchema).optional(),
  isActive: z.boolean().optional(),
});

export type ResourceUpdateForm = z.infer<typeof resourceUpdateSchema>;

export const resourceDeleteSchema = z.object({
  resourceId: z.string().min(1),
});

export type ResourceDeleteForm = z.infer<typeof resourceDeleteSchema>;
