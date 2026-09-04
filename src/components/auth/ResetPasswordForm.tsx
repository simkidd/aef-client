'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Mail,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field';
import { authApi } from '@/lib/api/auth.api';
import { toast } from '@/components/ui/toast';

// Co-located Form Schema
export const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail, { shouldValidate: true });
    }
  }, [initialEmail, setValue]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      // First verify OTP for password reset
      await authApi.verifyOtp({
        email: data.email,
        otp: data.otp.trim(),
        purpose: 'PASSWORD_RESET',
      });

      // Update password
      const res = await authApi.resetPassword({
        email: data.email,
        otp: data.otp.trim(),
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      return res;
    },
    onSuccess: (res) => {
      const msg =
        res.data?.message ||
        res.message ||
        'Password successfully updated. You can now log in.';
      setSuccess(msg);
      toast.add({
        title: 'Password updated',
        description: 'Your password has been successfully reset. You can now log in.',
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Reset failed',
        description:
          err.response?.data?.message ||
          err.message ||
          'Password reset failed. Please check your verification code.',
        type: 'error',
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. Header Typography with Dashboard Card Divider */}
      <div className="space-y-1 text-left border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
          Set new password
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter the 6-digit code sent to your email and choose a new password.
        </p>
      </div>

      {/* 2. State & Form */}
      {success ? (
        <div className="space-y-4 text-center py-3 bg-muted/40 border border-border rounded-lg p-5">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground font-heading">Password Reset Complete</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your password has been updated. You can now sign in with your new credentials.
            </p>
          </div>
          <div className="pt-1">
            <Link href="/auth/login">
              <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer">
                <span>Back to Sign In</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">

          <FieldSet>
            <FieldGroup className="space-y-2.5">
              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-foreground">
                  Email Address
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@adelefoundation.org"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.email.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="otp" className="text-xs font-semibold text-foreground">
                  6-Digit Verification Code
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm tracking-widest font-mono text-base focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    maxLength={6}
                    {...register('otp')}
                  />
                </div>
                {errors.otp ? (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.otp.message}</p>
                ) : (
                  <FieldDescription className="text-muted-foreground text-[10px] mt-0.5">
                    Valid for 10 minutes
                  </FieldDescription>
                )}
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Field>
                  <FieldLabel htmlFor="newPassword" className="text-xs font-semibold text-foreground">
                    New Password
                  </FieldLabel>
                  <div className="relative w-full mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                      {...register('newPassword')}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.newPassword.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative w-full mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating Password...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Reset Password</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* 3. Secondary Navigation */}
      <div className="pt-1 text-center text-xs">
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:underline inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
