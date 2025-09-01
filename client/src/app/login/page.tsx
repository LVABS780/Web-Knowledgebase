"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { type LoginForm, loginSchema } from "@/lib/userSchema";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "../contexts/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const role = user?.role;

  const normalizedRole =
    role === "SUPER_ADMIN"
      ? "SUPER_ADMIN"
      : role === "COMPANY_ADMIN"
      ? "COMPANY_ADMIN"
      : undefined;

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const { errors } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const mutation = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = (values: LoginForm) => {
    mutation.mutate(values);
  };

  const roleLabel =
    normalizedRole === "SUPER_ADMIN"
      ? "Super Admin"
      : normalizedRole === "COMPANY_ADMIN"
      ? "Company Admin"
      : "User";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center space-y-4 p-6">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                KnowledgeHub
              </span>
            </div>

            <CardTitle className="text-2xl">{`Welcome ${roleLabel}`}</CardTitle>
            <CardDescription>
              Sign in to your KnowledgeHub Account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-2 focus:border-primary transition-colors duration-200 h-12"
                      {...register("email")}
                      disabled={mutation.isPending}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-12 border-2 focus:border-primary transition-colors duration-200 h-12"
                      {...register("password")}
                      disabled={mutation.isPending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                      disabled={mutation.isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 text-lg hover:scale-105 transition-transform duration-200"
              >
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </Button>

              {mutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {mutation.error?.message ??
                      "Login failed. Please check your credentials and try again."}
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
