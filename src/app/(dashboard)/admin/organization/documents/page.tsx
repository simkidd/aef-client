import React from 'react';
import { Metadata } from 'next';
import { DocumentsView } from '@/components/admin/organization/documents/DocumentsView';

export const metadata: Metadata = {
  title: 'Documents & Policies | Adele Foundation Admin',
  description: 'Access organization charters, training curriculums, and standard operating procedures.',
};

export default function DocumentsPage() {
  return <DocumentsView />;
}
