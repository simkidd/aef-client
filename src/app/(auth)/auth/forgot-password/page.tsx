import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password — Adele Empowerment Foundation',
  description: 'Request a one-time password reset code for your Adele Foundation account.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <ForgotPasswordForm />
    </div>
  );
}
