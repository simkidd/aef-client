import React from 'react';
import { Metadata } from 'next';
import { FacilitiesView } from '@/components/admin/organization/facilities/FacilitiesView';

export const metadata: Metadata = {
  title: 'Rooms & Facilities | Adele Foundation Admin',
  description: 'Manage computer labs, training workshops, practical studios, and lecture halls.',
};

export default function FacilitiesPage() {
  return <FacilitiesView />;
}
