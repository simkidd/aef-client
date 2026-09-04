'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  KeyRound,
  Mail,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
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
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/components/ui/toast';

// Co-located Form Schema
export const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  purpose: z.enum(['LOGIN', 'PASSWORD_RESET', 'VERIFY_EMAIL', 'ENROLLMENT']),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export function VerifyOtpForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: '',
      otp: '',
      purpose: 'VERIFY_EMAIL',
    },
  });

  const emailValue = watch('email');
  const purposeValue = watch('purpose');

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpFormData) =>
      authApi.verifyOtp({
        email: data.email,
        otp: data.otp.trim(),
        purpose: data.purpose,
      }),
    onSuccess: (res, variables) => {
      const msg = res.data?.message || res.message || 'Verification successful!';
      setSuccess(msg);
      toast.add({
        title: 'Verification successful',
        description: msg,
        type: 'success',
      });

      if (variables.purpose === 'PASSWORD_RESET') {
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(variables.email)}`);
        }, 1000);
      } else if (variables.purpose === 'LOGIN' && res.data?.accessToken) {
        setTimeout(() => {
          router.push('/portal');
        }, 1000);
      }
    },
    onError: (err: any) => {
      toast.add({
        title: 'Verification failed',
        description:
          err.response?.data?.message || err.message || 'Invalid or expired OTP code.',
        type: 'error',
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: ({
      email,
      purpose,
    }: {
      email: string;
      purpose: 'LOGIN' | 'PASSWORD_RESET' | 'VERIFY_EMAIL' | 'ENROLLMENT';
    }) =>
      authApi.sendOtp({
        email,
        purpose,
      }),
    onSuccess: (res) => {
      const msg = res.data?.message || res.message || 'New OTP sent to your email.';
      setSuccess(msg);
      toast.add({
        title: 'New code sent',
        description: msg,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to send code',
        description:
          err.response?.data?.message || err.message || 'Failed to dispatch new OTP.',
        type: 'error',
      });
    },
  });

  const onSubmit = (data: VerifyOtpFormData) => {
    setSuccess(null);
    verifyOtpMutation.mutate(data);
  };

  const handleResend = () => {
    if (!emailValue) {
      toast.add({
        title: 'Email required',
        description: 'Please enter your email address first.',
        type: 'warning',
      });
      return;
    }
    resendOtpMutation.mutate({ email: emailValue, purpose: purposeValue });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. Header Typography with Dashboard Card Divider */}
      <div className="space-y-1 text-left border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
          Verify your email
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter the 6-digit verification code sent to your email address.
        </p>
      </div>

      {/* 2. State & Form */}
      {success ? (
        <div className="space-y-4 text-center py-3 bg-muted/40 border border-border rounded-lg p-5">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground font-heading">Verification Successful</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{success}</p>
          </div>
          <div className="pt-1">
            <Link href="/auth/login">
              <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer">
                <span>Continue to Sign In</span>
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
                    placeholder="e.g. name@adelefoundation.org"
                    className="pl-9.5 h-10 bg-background/50 border-input rounded-lg text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.email.message}</p>}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="otp" className="text-xs font-semibold text-foreground">
                    6-Digit Verification Code
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendOtpMutation.isPending}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {resendOtpMutation.isPending ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                    <span>Resend code</span>
                  </button>
                </div>
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
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            disabled={verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Code...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Verify Code</span>
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
