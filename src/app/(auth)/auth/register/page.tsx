import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Beneficiary Profile — Adele Empowerment Foundation',
  description: 'Register your single permanent beneficiary identity across all Adele Foundation training programs.',
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <RegisterForm />
    </div>
  );
}
