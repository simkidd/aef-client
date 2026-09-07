import React from 'react';
import { Metadata } from 'next';
import { PartnersView } from '@/components/admin/organization/partners/PartnersView';

export const metadata: Metadata = {
  title: 'Partners & Sponsors | Adele Foundation Admin',
  description: 'Manage corporate partners, sponsors, funding grantors, and hiring alliances.',
};

export default function PartnersPage() {
  return <PartnersView />;
}
