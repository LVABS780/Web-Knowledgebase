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
  companyCreateSchema,
  companyUpdateSchema,
  type CompanyCreateForm,
  type CompanyUpdateForm,
} from "@/lib/userSchema";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useCompanyById,
} from "@/hooks/useCompanies";
import { Edit, Eye, EyeOff, Building } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import type { ZodTypeAny } from "zod";

type FormSchema = CompanyCreateForm | CompanyUpdateForm;

const CompanyRegistrationSheet = ({
  companyId,
  fromDashboardPage,
}: {
  companyId?: string;
  fromDashboardPage?: boolean;
}) => {
  const isEditMode = Boolean(companyId);
  const [isRegisterSheetOpen, setIsRegisterSheetOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: companyDetails } = useCompanyById?.(
    companyId,
    isEditMode && isRegisterSheetOpen
  );

  const { mutate: createCompany, isPending: isCreating } =
    useCreateCompanyMutation();
  const { mutate: updateCompany, isPending: isUpdating } =
    useUpdateCompanyMutation();

  const schema = isEditMode ? companyUpdateSchema : companyCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema as ZodTypeAny),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      isActive: true,
      ...(isEditMode && companyId && { companyId }),
    } as Partial<FormSchema>,
  });

  useEffect(() => {
    if (isRegisterSheetOpen && isEditMode && companyDetails) {
      reset({
        companyId,
        name: companyDetails.companyAdmin?.name || "",
        email: companyDetails.companyAdmin?.email || "",
        phone: companyDetails.companyAdmin?.phone || "",
        address: companyDetails.company.address || "",
        isActive: companyDetails.company.isActive,
        password: "",
      } as Partial<FormSchema>);
    } else if (!isEditMode) {
      reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        isActive: true,
      } as Partial<FormSchema>);
    }
  }, [isRegisterSheetOpen, companyDetails, reset, isEditMode, companyId]);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (isEditMode && companyId) {
      if (!isDirty) {
        toast.info("No changes detected");
        return;
      }

      updateCompany(data as CompanyUpdateForm, {
        onSuccess: () => {
          toast.success("Company updated successfully!");
          reset();
          setIsRegisterSheetOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to update company. Please try again.");
          console.error("Update company error:", error);
        },
      });
    } else {
      createCompany(data as CompanyCreateForm, {
        onSuccess: () => {
          toast.success("Company created successfully!");
          reset();
          setIsRegisterSheetOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to create company. Please try again.");
          console.error("Create company error:", error);
        },
      });
    }
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
            <Building className="h-6 w-6 text-blue-600 cursor-pointer dark:text-white" />
            <span className="absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Onboard a new company
            </span>
          </span>
        ) : (
          <Button
            className="bg-[#6A00B4] text-white hover:bg-blue-800 hover:text-white"
            variant="outline"
          >
            Register Company
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto items-center px-5"
      >
        <SheetHeader>
          <SheetTitle className="text-xl text-center">
            {isEditMode ? "Update Company Info" : "New Company Registration"}
          </SheetTitle>
          <SheetDescription>
            Fill in the details to {isEditMode ? "update" : "onboard a new"}{" "}
            company.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 space-y-6 max-w-4/5 container mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3">
            <div className="space-y-1.5">
              <Label>
                Company Name
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                type="text"
                {...register("name")}
                className="custom-border shadow-sm"
                placeholder="Company name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Admin Email
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                type="email"
                {...register("email")}
                className="custom-border shadow-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Admin Phone</Label>
              <Input
                type="tel"
                {...register("phone")}
                className="custom-border shadow-sm"
                placeholder="Phone number (10 digits)"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Password
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="custom-border shadow-sm pr-10"
                  placeholder={
                    isEditMode
                      ? "Leave blank to keep current password"
                      : "Set initial password (min 6 characters)"
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Company Address</Label>
              <Input
                type="text"
                {...register("address")}
                className="custom-border shadow-sm"
                placeholder="Company address"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            {isEditMode && (
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <label className="md:col-span-2 space-y-1.5 cursor-pointer">
                    <Label>Company Status</Label>
                    <div className="custom-border shadow-sm flex items-center justify-between p-3 rounded-md cursor-pointer">
                      <p className="text-sm text-muted-foreground">
                        Toggle on if you want to activate the company
                      </p>
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </label>
                )}
              />
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-10 px-10 my-8">
            <Button
              type="button"
              variant="outline"
              className="bg-[#6A00B4] text-white hover:bg-blue-800 hover:text-white"
              onClick={() => setIsRegisterSheetOpen(false)}
              disabled={isSubmitting}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-[#6A00B4] text-white hover:bg-blue-800 hover:text-white"
              variant="outline"
              disabled={isSubmitting}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              type="submit"
              className="bg-[#6A00B4] text-white hover:bg-blue-800 hover:text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CompanyRegistrationSheet;
