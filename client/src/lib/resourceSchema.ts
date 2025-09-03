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

export const resourceCreateSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().optional(),
    categoryName: z.string().optional(),
    sections: z.array(sectionSchema).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      return Boolean(data.categoryId) || Boolean(data.categoryName);
    },
    {
      message: "Select a category or enter a category name",
      path: ["categoryId"],
    }
  )
  .refine(
    (data) => {
      if (data.categoryId === "OTHER") {
        return Boolean(
          data.categoryName && data.categoryName.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Category name is required when OTHER is selected",
      path: ["categoryName"],
    }
  );

export const resourceUpdateSchema = z
  .object({
    resourceId: z.string(),
    title: emptyToUndefined(z.string().min(1, "Title is required")),
    description: emptyToUndefined(z.string().min(1, "Description is required")),
    categoryId: z.string().optional(),
    categoryName: z.string().optional(),
    sections: z.array(sectionSchema).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.categoryId || data.categoryName) return true;
      return true;
    },
    { message: "", path: ["categoryId"] }
  )
  .refine(
    (data) => {
      if (data.categoryId === "OTHER") {
        return Boolean(
          data.categoryName && data.categoryName.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Category name is required when OTHER is selected",
      path: ["categoryName"],
    }
  );

export const resourceDeleteSchema = z.object({
  resourceId: z.string().min(1),
});

export type ResourceCreateForm = z.infer<typeof resourceCreateSchema>;
export type ResourceUpdateForm = z.infer<typeof resourceUpdateSchema>;
export type ResourceDeleteForm = z.infer<typeof resourceDeleteSchema>;
