"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  ShieldCheck,
  Building2,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "@/components/ui/toast";

// Co-located Form Schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    role: "Super Admin",
    scope: "Full System",
    email: "admin@adelefoundation.org",
    pass: "Admin@2026",
    icon: ShieldCheck,
  },
  {
    role: "Centre Manager",
    scope: "PH Centre Lead",
    email: "manager@adelefoundation.org",
    pass: "Manager@2026",
    icon: Building2,
  },
  {
    role: "Trainer / Instructor",
    scope: "Solar PV Faculty",
    email: "trainer@adelefoundation.org",
    pass: "Trainer@2026",
    icon: GraduationCap,
  },
  {
    role: "Trainee / Student",
    scope: "Student Portal",
    email: "trainee@adelefoundation.org",
    pass: "Trainee@2026",
    icon: UserCheck,
  },
];

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const activeEmail = watch("email");

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      authApi.login({
        email: data.email,
        password: data.password,
      }),
    onSuccess: (res) => {
      if (res.data) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        queryClient.setQueryData(["auth", "me"], res.data.user);
        toast.add({
          title: "Signed in successfully",
          description: `Welcome back, ${res.data.user.firstName || "User"}!`,
          type: "success",
        });
        const user = res.data.user;
        if (user.isStaff || user.roles?.includes("SUPER_ADMIN")) {
          router.push("/admin");
        } else {
          router.push("/portal");
        }
      }
    },
    onError: (err: any) => {
      toast.add({
        title: "Sign in failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Unable to sign in. Please verify your email and password.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setValue("email", demoEmail, { shouldValidate: true });
    setValue("password", demoPass, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. Header Typography with Dashboard Card Divider */}
      <div className="space-y-1 text-left border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
          Welcome back
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter your credentials to continue to your account.
        </p>
      </div>

      {/* 2. Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-xs font-semibold text-foreground"
              >
                Email Address
              </FieldLabel>
              <div className="relative w-full mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. name@adelefoundation.org"
                  className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-destructive mt-0.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground"
                >
                  Password
                </FieldLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative w-full mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9.5 pr-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-destructive mt-0.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <Button
          type="submit"
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* 3. Quick Fill Demo Accounts */}
      <div className="pt-3 border-t border-border/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Quick Fill Demo Accounts
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Click to populate
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            const isSelected = activeEmail === acc.email;

            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoFill(acc.email, acc.pass)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? "border-primary/50 bg-primary/10 shadow-2xs font-medium"
                    : "bg-muted/30 hover:bg-muted/60 border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary transition-colors"
                    }`}
                  />
                  <p
                    className={`text-xs font-semibold truncate ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {acc.role}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate pl-5">
                  {acc.scope}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Secondary Navigation */}
      <div className="pt-1 space-y-2 text-center text-xs">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
        <Link
          href="/auth/verify-otp"
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <KeyRound className="h-3 w-3 text-primary" />
          <span>Verify email with code</span>
        </Link>
      </div>
    </div>
  );
}
