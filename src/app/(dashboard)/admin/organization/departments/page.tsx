import React from 'react';
import { Metadata } from 'next';
import { DepartmentsView } from '@/components/admin/organization/departments';

export const metadata: Metadata = {
  title: 'Departments & Org Structure | Adele Foundation Admin',
  description: 'Manage foundation organizational departments, mandates, and designated leadership.',
};

export default function DepartmentsPage() {
  return <DepartmentsView />;
}
