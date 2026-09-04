import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Adele Empowerment Foundation',
  description: 'Sign in to access your Adele Foundation management console or beneficiary portal.',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <LoginForm />
    </div>
  );
}
