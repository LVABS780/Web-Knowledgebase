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
import { Textarea } from "@/components/ui/textarea";
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

  const schema = isEditMode ? resourceUpdateSchema : resourceCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema as ZodTypeAny),
    defaultValues: {
      title: "",
      description: "",
      isActive: true,
      sections: [{ subtitle: "", description: "" }],
      ...(isEditMode && resourceId && { resourceId }),
    } as Partial<FormSchema>,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const watchedSections = watch("sections");

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
        isActive: resourceDetails.isActive,
        sections: sectionsToSet,
      } as Partial<FormSchema>);
    } else if (!isEditMode) {
      reset({
        title: "",
        description: "",
        isActive: true,
        sections: [{ subtitle: "", description: "" }],
      } as Partial<FormSchema>);
    }
  }, [isRegisterSheetOpen, resourceDetails, reset, isEditMode, resourceId]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (isEditMode && resourceId) {
      if (!isDirty) {
        toast.info("No changes detected");
        return;
      }

      updateResource(data as ResourceUpdateForm, {
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
      createResource(data as ResourceCreateForm, {
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

  const sectionHasContent = (index: number) => {
    const section = watchedSections?.[index];
    return section?.subtitle?.trim() || section?.description?.trim();
  };

  const canDeleteSection = (index: number) => {
    if (index === 0) {
      return fields.length > 1 && !sectionHasContent(index);
    }

    if (sectionHasContent(index)) return false;

    return true;
  };

  const isSubmitting = isEditMode ? isUpdating : isCreating;

  return (
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
              <Label>Resource Description</Label>
              <Textarea
                {...register("description")}
                className="custom-border shadow-sm min-h-[120px] resize-none"
                placeholder="Enter detailed description of the resource"
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
                    <Textarea
                      {...register(`sections.${index}.description` as const)}
                      className="custom-border shadow-sm min-h-[100px] resize-none"
                      placeholder="Enter section description"
                    />
                    {errors.sections?.[index]?.description && (
                      <p className="text-sm text-red-500">
                        {errors.sections[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  {canDeleteSection(index) && (
                    <Button
                      type="button"
                      variant="outline"
                      className=""
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

            {/* Resource Status Toggle - Now available for both create and edit */}
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
  );
};

export default CreateResource;
