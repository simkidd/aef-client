'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_PERMISSION_MAP } from '@/config/admin-navigation.config';
import { AccessDeniedView } from '@/components/common/AccessDeniedView';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, hasPermission, initialized } = useAuthStore();

  // Find exact or parent route requirement
  const matchingRule = useMemo(() => {
    if (ROUTE_PERMISSION_MAP[pathname]) {
      return ROUTE_PERMISSION_MAP[pathname];
    }
    const matchingRoute = Object.keys(ROUTE_PERMISSION_MAP).find(
      (route) => pathname.startsWith(route + '/')
    );
    return matchingRoute ? ROUTE_PERMISSION_MAP[matchingRoute] : null;
  }, [pathname]);

  const isAccessDenied = useMemo(() => {
    if (!initialized || !matchingRule || !user) return false;
    // Super admin has unrestricted access to all routes
    if (user.roles?.includes('SUPER_ADMIN')) return false;
    // Check required permission
    return !hasPermission(matchingRule.permission);
  }, [initialized, matchingRule, user, hasPermission]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50/60 dark:bg-slate-950">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            {isAccessDenied ? (
              <AccessDeniedView
                pageTitle={matchingRule?.label}
                requiredPermission={matchingRule?.permission}
              />
            ) : (
              children
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;

