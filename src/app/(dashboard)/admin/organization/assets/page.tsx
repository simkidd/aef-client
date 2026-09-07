import React from 'react';
import { Metadata } from 'next';
import { AssetsView } from '@/components/admin/organization/assets/AssetsView';

export const metadata: Metadata = {
  title: 'Physical Assets & Inventory | Adele Foundation Admin',
  description: 'Manage equipment, computers, laboratory hardware, and biometric terminals.',
};

export default function AssetsPage() {
  return <AssetsView />;
}
