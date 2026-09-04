import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm';

export const metadata: Metadata = {
  title: 'OTP Verification — Adele Empowerment Foundation',
  description: 'Verify your email address using the one-time password (OTP) code.',
};

export default function VerifyOtpPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading verification form...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
