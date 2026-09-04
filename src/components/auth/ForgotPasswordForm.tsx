'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  ArrowRight,
  CheckCircle2,
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
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      authApi.sendOtp({
        email: data.email,
        purpose: 'PASSWORD_RESET',
      }),
    onSuccess: (res, variables) => {
      setSubmittedEmail(variables.email);
      const msg =
        res.data?.message ||
        res.message ||
        'Password reset OTP sent to your registered email address.';
      setSuccess(msg);
      toast.add({
        title: 'Reset code sent',
        description: `A 6-digit recovery code has been sent to ${variables.email}.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Dispatch failed',
        description:
          err.response?.data?.message ||
          err.message ||
          'Failed to dispatch password reset request.',
        type: 'error',
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendOtpMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. Header Typography with Dashboard Card Divider */}
      <div className="space-y-1 text-left border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
          Reset password
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter your email address to receive a 6-digit recovery code.
        </p>
      </div>

      {/* 2. State & Form */}
      {success ? (
        <div className="space-y-4 text-center py-3 bg-muted/40 border border-border rounded-lg p-5">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground font-heading">Check your email</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{success}</p>
          </div>
          <div className="pt-1">
            <Link href={`/auth/reset-password?email=${encodeURIComponent(submittedEmail)}`}>
              <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer">
                <span>Enter Code & Reset Password</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-foreground">
                  Email Address
                </FieldLabel>
                <div className="relative w-full mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. name@adelefoundation.org"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    {...register('email')}
                  />
                </div>
                {errors.email ? (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.email.message}</p>
                ) : (
                  <FieldDescription className="text-muted-foreground text-[10px] mt-0.5">
                    We will send a 6-digit verification code to this address.
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            disabled={sendOtpMutation.isPending}
          >
            {sendOtpMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Code...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Send Reset Code</span>
                <ArrowRight className="h-4 w-4" />
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

