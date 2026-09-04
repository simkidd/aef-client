import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Set New Password — Adele Empowerment Foundation',
  description: 'Enter your OTP code and set a new password for your account.',
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading password reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
