"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "@/components/ui/toast";

// Co-located Form Schema
export const registerBeneficiarySchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Residential address is required"),
  stateOfOrigin: z.string().min(2, "State of origin is required"),
  lgaOfOrigin: z.string().min(2, "LGA of origin is required"),
  stateOfResidence: z.string().min(2, "State of residence is required"),
  lgaOfResidence: z.string().min(2, "LGA of residence is required"),
  highestEducation: z.string().min(2, "Educational qualification is required"),
  employmentStatus: z.string().min(2, "Employment status is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(10, "Emergency contact phone number is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
});

export type RegisterBeneficiaryFormData = z.infer<
  typeof registerBeneficiarySchema
>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterBeneficiaryFormData>({
    resolver: zodResolver(registerBeneficiarySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      gender: "Male",
      dateOfBirth: "2002-01-01",
      address: "",
      stateOfOrigin: "Lagos",
      lgaOfOrigin: "Ikeja",
      stateOfResidence: "Lagos",
      lgaOfResidence: "Ikeja",
      highestEducation: "Secondary (SSCE/WAEC)",
      employmentStatus: "Unemployed",
      emergencyContactName: "Family Member",
      emergencyContactPhone: "",
      emergencyContactRelationship: "Parent",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterBeneficiaryFormData) =>
      authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        stateOfOrigin: data.stateOfOrigin,
        lgaOfOrigin: data.lgaOfOrigin,
        stateOfResidence: data.stateOfResidence,
        lgaOfResidence: data.lgaOfResidence,
        highestEducation: data.highestEducation,
        employmentStatus: data.employmentStatus,
        emergencyContact: {
          name: data.emergencyContactName || "Family Member",
          phone: data.emergencyContactPhone || data.phone,
          relationship: data.emergencyContactRelationship || "Parent",
        },
      }),
    onSuccess: (res) => {
      toast.add({
        title: "Account created successfully",
        description: "Welcome to Adele Empowerment Foundation.",
        type: "success",
      });
      if (res.data) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        queryClient.setQueryData(["auth", "me"], res.data.user);
      }
      router.push("/portal");
    },
    onError: (err: any) => {
      toast.add({
        title: "Registration failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Unable to create account. Please review your inputs and try again.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: RegisterBeneficiaryFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. Header Typography with Dashboard Card Divider */}
      <div className="space-y-1 text-left border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
          Create an account
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sign up to apply for vocational tracks and access training programs.
        </p>
      </div>

      {/* 2. Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Field>
                <FieldLabel
                  htmlFor="firstName"
                  className="text-xs font-semibold text-foreground"
                >
                  First Name *
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="firstName"
                    placeholder="e.g. Amina"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    {...register("firstName")}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="lastName"
                  className="text-xs font-semibold text-foreground"
                >
                  Last Name *
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="lastName"
                    placeholder="e.g. Bello"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    {...register("lastName")}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email Address *
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. amina@example.com"
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
                <FieldLabel
                  htmlFor="phone"
                  className="text-xs font-semibold text-foreground"
                >
                  Phone Number *
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phone"
                    placeholder="+234 810 000 0000"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground"
                >
                  Create Password *
                </FieldLabel>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              <Field>
                <FieldLabel
                  htmlFor="gender"
                  className="text-xs font-semibold text-foreground"
                >
                  Gender *
                </FieldLabel>
                <div className="mt-1">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger
                          id="gender"
                          className="w-full h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs cursor-pointer"
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.gender && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.gender.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Field>
                <FieldLabel
                  htmlFor="highestEducation"
                  className="text-xs font-semibold text-foreground"
                >
                  Highest Education *
                </FieldLabel>
                <div className="mt-1">
                  <Controller
                    name="highestEducation"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger
                          id="highestEducation"
                          className="w-full h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs cursor-pointer"
                        >
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Secondary (SSCE/WAEC)">
                            Secondary (SSCE/WAEC)
                          </SelectItem>
                          <SelectItem value="OND/NCE">OND/NCE</SelectItem>
                          <SelectItem value="HND/BSc">HND/BSc</SelectItem>
                          <SelectItem value="Vocational Certificate">
                            Vocational Certificate
                          </SelectItem>
                          <SelectItem value="Primary">Primary</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.highestEducation && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.highestEducation.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="employmentStatus"
                  className="text-xs font-semibold text-foreground"
                >
                  Employment Status *
                </FieldLabel>
                <div className="mt-1">
                  <Controller
                    name="employmentStatus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger
                          id="employmentStatus"
                          className="w-full h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs cursor-pointer"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unemployed">Unemployed</SelectItem>
                          <SelectItem value="Self-Employed">
                            Self-Employed
                          </SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Employed Part-Time">
                            Employed Part-Time
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.employmentStatus && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.employmentStatus.message}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel
                htmlFor="address"
                className="text-xs font-semibold text-foreground"
              >
                Residential Address *
              </FieldLabel>
              <div className="relative w-full mt-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="address"
                  placeholder="e.g. 12 Adeleke Street, Ikeja"
                  className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                  {...register("address")}
                />
              </div>
              {errors.address && (
                <p className="text-[10px] text-destructive mt-0.5 font-medium">
                  {errors.address.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <Button
          type="submit"
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Create Account</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* 3. Secondary Navigation */}
      <div className="pt-1 text-center text-xs">
        <p className="text-muted-foreground">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
