'use client';

import React from 'react';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50/60 dark:bg-slate-950">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
