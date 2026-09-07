import React from 'react';
import { Metadata } from 'next';
import { VolunteersView } from '@/components/admin/organization/volunteers/VolunteersView';

export const metadata: Metadata = {
  title: 'Volunteers & Mentors | Adele Foundation Admin',
  description: 'Track community volunteers, mentor service hours, and field operations.',
};

export default function VolunteersPage() {
  return <VolunteersView />;
}
