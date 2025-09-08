"use client";

import React, { useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  letsConnectCreateSchema,
  type LetsConnectCreateForm,
} from "../lib/connectSchema";
import { useCreateLetsConnectMutation } from "../hooks/useConnect";

const servicesOptions = [
  "Web Development",
  "UI/UX Design",
  "Consulting",
  "Marketing",
  "Data Analytics",
];

export default function LetsConnectRegistrationSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: createLetsConnect, isPending } =
    useCreateLetsConnectMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LetsConnectCreateForm>({
    resolver: zodResolver(letsConnectCreateSchema),
    defaultValues: { name: "", email: "", phone: "", services: [] },
  });

  const onSubmit = async (data: LetsConnectCreateForm) => {
    try {
      await createLetsConnect(data);
      toast.success("Thanks! We'll reach out soon.");
      reset({ name: "", email: "", phone: "", services: [] });
      setIsOpen(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SheetTrigger asChild>
        <Button
          className="bg-[#6A00B4] text-white hover:bg-[#7f04d4]"
          variant="outline"
        >
          Let&apos;s Connect
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="max-h-[100vh] overflow-y-auto px-6 max-w-[500px] sm:max-w-[600px]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl text-center">
            Let&apos;s Connect
          </SheetTitle>
          <SheetDescription>
            Share a few details and the services you&apos;re interested in.
            We&apos;ll get back to you shortly.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-6"
        >
          <div className="space-y-1.5">
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              {...register("name")}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              type="tel"
              {...register("phone")}
              placeholder="10-digit phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Services <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {servicesOptions.map((s) => {
                    const checked = field.value?.includes(s) ?? false;
                    return (
                      <label
                        key={s}
                        className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), s]);
                            } else {
                              field.onChange(
                                (field.value || []).filter((x) => x !== s)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{s}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.services && (
              <p className="text-sm text-red-500">
                {errors.services.message as string}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                reset({ name: "", email: "", phone: "", services: [] })
              }
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-[#6A00B4] text-white hover:bg-[#7f04d4]"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
