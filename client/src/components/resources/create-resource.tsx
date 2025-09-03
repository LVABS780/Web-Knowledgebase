"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import {
  resourceCreateSchema,
  resourceUpdateSchema,
  type ResourceCreateForm,
  type ResourceUpdateForm,
} from "@/lib/resourceSchema";
import {
  Controller,
  useForm,
  type SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useResourceById,
  useResourceCategories,
} from "@/hooks/useResources";
import { Edit, FileText, Plus, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import type { ZodTypeAny } from "zod";

type FormSchema = ResourceCreateForm | ResourceUpdateForm;

const CreateResource = ({
  resourceId,
  fromDashboardPage,
}: {
  resourceId?: string;
  fromDashboardPage?: boolean;
}) => {
  const isEditMode = Boolean(resourceId);
  const [isRegisterSheetOpen, setIsRegisterSheetOpen] = useState(false);

  const { data: resourceDetails } = useResourceById?.(
    resourceId,
    isEditMode && isRegisterSheetOpen
  );

  const { mutate: createResource, isPending: isCreating } =
    useCreateResourceMutation();
  const { mutate: updateResource, isPending: isUpdating } =
    useUpdateResourceMutation();

  const { data: categories = [] } = useResourceCategories();

  const schema = isEditMode ? resourceUpdateSchema : resourceCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema as ZodTypeAny),
    defaultValues: {
      title: "",
      description: "",
      categoryId: categories.length === 0 ? "OTHER" : "",
      categoryName: "",
      isActive: true,
      sections: [{ subtitle: "", description: "" }],
      ...(isEditMode && resourceId && { resourceId }),
    } as Partial<FormSchema>,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const categoryId = watch("categoryId");
  const showCustomCategory = categoryId === "OTHER";

  useEffect(() => {
    if (categoryId && categoryId !== "OTHER") {
      setValue("categoryName", "");
    }
  }, [categoryId, setValue]);

  useEffect(() => {
    if (isRegisterSheetOpen && isEditMode && resourceDetails) {
      const sectionsToSet =
        resourceDetails.sections && resourceDetails.sections.length > 0
          ? resourceDetails.sections
          : [{ subtitle: "", description: "" }];

      reset({
        resourceId,
        title: resourceDetails.title || "",
        description: resourceDetails.description || "",
        categoryId: resourceDetails.categoryId || "",
        categoryName: resourceDetails.categoryName || "",
        isActive: resourceDetails.isActive,
        sections: sectionsToSet,
      } as Partial<FormSchema>);
    } else if (!isEditMode) {
      reset({
        title: "",
        description: "",
        categoryId: "",
        categoryName: "",
        isActive: true,
        sections: [{ subtitle: "", description: "" }],
      } as Partial<FormSchema>);
    }
  }, [isRegisterSheetOpen, resourceDetails, reset, isEditMode, resourceId]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const isOtherCategory = data.categoryId === "OTHER";

    if (isEditMode && resourceId) {
      if (!isDirty) {
        toast.info("No changes detected");
        return;
      }

      const payload: ResourceUpdateForm = {
        resourceId,
        title: data.title,
        description: data.description,
        sections: data.sections,
        isActive: data.isActive,
        ...(isOtherCategory
          ? { categoryName: data.categoryName }
          : { categoryId: data.categoryId }),
      };

      updateResource(payload, {
        onSuccess: () => {
          toast.success("Resource updated successfully!");
          reset();
          setIsRegisterSheetOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update resource. Please try again.");
          console.error("Update resource error:", error);
        },
      });
    } else {
      const formData = data as ResourceCreateForm;
      const payload: ResourceCreateForm = {
        title: formData.title,
        description: formData.description,
        sections: formData.sections,
        isActive: formData.isActive,
        ...(isOtherCategory
          ? { categoryName: formData.categoryName }
          : { categoryId: formData.categoryId }),
      };

      createResource(payload, {
        onSuccess: () => {
          toast.success("Resource created successfully!");
          reset();
          setIsRegisterSheetOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to create resource. Please try again.");
          console.error("Create resource error:", error);
        },
      });
    }
  };

  const isSubmitting = isEditMode ? isUpdating : isCreating;

  const getTinyMCEConfig = (height = 300) => ({
    base_url: "/tinymce",
    suffix: ".min",
    promotion: false,
    branding: false,
    height,
    menubar: false,
    plugins:
      "advlist autolink lists link charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table wordcount",
    toolbar:
      "undo redo | blocks | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | link ",
    content_style:
      "body { font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji',sans-serif; font-size:14px }",
    resize: false,
    statusbar: false,
    ui_mode: "split" as const,
    setup: (editor: TinyMCEEditor) => {
      editor.on("OpenWindow", () => {
        const modal = document.querySelector(".tox-dialog-wrap");
        if (modal) {
          (modal as HTMLElement).style.zIndex = "100000";
        }
      });
    },
    modal: true,
    inline_boundaries: false,
  });

  return (
    <>
      <style>{`
        .tox-dialog-wrap {
          z-index: 100000 !important;
        }
        .tox-dialog {
          z-index: 100001 !important;
        }
        .tox-dialog__backdrop {
          z-index: 99999 !important;
        }
        .tox-textfield {
          z-index: 100002 !important;
        }
        .tox .tox-dialog__header {
          z-index: 100002 !important;
        }
        .tox .tox-dialog__body {
          z-index: 100002 !important;
        }
        .tox .tox-dialog__footer {
          z-index: 100002 !important;
        }
      `}</style>

      <Sheet
        open={isRegisterSheetOpen}
        onOpenChange={setIsRegisterSheetOpen}
      >
        <SheetTrigger asChild>
          {isEditMode ? (
            <Edit className="size-5 text-green-500 cursor-pointer" />
          ) : fromDashboardPage ? (
            <span className="relative inline-block group bg-blue-100 rounded-full p-2 dark:bg-gray-700">
              <FileText className="h-6 w-6 text-blue-600 cursor-pointer dark:text-white" />
              <span className="absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                Create a new resource
              </span>
            </span>
          ) : (
            <Button
              className="bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Resource
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto items-center px-5"
          onPointerDownOutside={(e) => {
            if (
              (e.target as Element).closest(".tox-dialog") ||
              (e.target as Element).closest(".tox-dialog-wrap")
            ) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (
              (e.target as Element).closest(".tox-dialog") ||
              (e.target as Element).closest(".tox-dialog-wrap")
            ) {
              e.preventDefault();
            }
          }}
          onOpenAutoFocus={(e) => {
            if (document.querySelector(".tox-dialog")) {
              e.preventDefault();
            }
          }}
        >
          <SheetHeader>
            <SheetTitle className="text-xl text-center">
              {isEditMode ? "Update Resource" : "Create New Resource"}
            </SheetTitle>
            <SheetDescription>
              Fill in the details to {isEditMode ? "update" : "create a new"}{" "}
              resource.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-3 space-y-6 max-w-4/5 container mx-auto"
          >
            <div className="grid grid-cols-1 gap-4 space-y-3">
              <div className="space-y-1.5">
                <Label>Resource Title</Label>
                <Input
                  type="text"
                  {...register("title")}
                  className="custom-border shadow-sm"
                  placeholder="Enter resource title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full custom-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <SelectItem value="OTHER">
                            Add New Category
                          </SelectItem>
                        ) : (
                          <>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="OTHER">OTHER</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              {showCustomCategory && (
                <div className="space-y-1.5">
                  <Label>Category Name</Label>
                  <Input
                    type="text"
                    {...register("categoryName")}
                    className="custom-border shadow-sm"
                    placeholder="Enter category name..."
                  />
                  {errors.categoryName && isSubmitted && (
                    <p className="text-red-500">
                      {errors.categoryName.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Resource Description</Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { value, onChange } }) => (
                    <Editor
                      tinymceScriptSrc="/tinymce/tinymce.min.js"
                      value={value as string}
                      licenseKey="gpl"
                      onEditorChange={(content) => onChange(content)}
                      init={getTinyMCEConfig(300)}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Sections</Label>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-3 shadow-sm bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm text-gray-700">
                        Section {index + 1}
                      </h4>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Subtitle</Label>
                      <Input
                        type="text"
                        {...register(`sections.${index}.subtitle` as const)}
                        className="custom-border shadow-sm"
                        placeholder="Enter section subtitle"
                      />
                      {errors.sections?.[index]?.subtitle && (
                        <p className="text-sm text-red-500">
                          {errors.sections[index]?.subtitle?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <Controller
                        control={control}
                        name={`sections.${index}.description` as const}
                        render={({ field: { value, onChange } }) => (
                          <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            value={value as string}
                            licenseKey="gpl"
                            onEditorChange={(content) => onChange(content)}
                            init={getTinyMCEConfig(300)}
                          />
                        )}
                      />
                      {errors.sections?.[index]?.description && (
                        <p className="text-sm text-red-500">
                          {errors.sections[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                      >
                        <Trash2Icon className="text-green-600" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => append({ subtitle: "", description: "" })}
                  className="bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add More Section
                </Button>
              </div>

              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <label className="space-y-1.5 cursor-pointer">
                    <Label>Resource Status</Label>
                    <div className="custom-border shadow-sm flex items-center justify-between p-3 rounded-md cursor-pointer">
                      <p className="text-sm text-muted-foreground">
                        {isEditMode
                          ? "Toggle on if you want to publish the resource"
                          : "Toggle on to publish the resource immediately after creation"}
                      </p>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#6A00B4] data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                  </label>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-10 px-10 my-8">
              <Button
                type="button"
                variant="outline"
                className="bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                onClick={() => setIsRegisterSheetOpen(false)}
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => reset()}
                className="bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                variant="outline"
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                type="submit"
                className="bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateResource;
