"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { PortalSidebar } from "./PortalSidebar";
import { PortalHeader } from "./PortalHeader";

export function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50/70 dark:bg-slate-950">
        {/* Modern Collapsible Shadcn Sidebar */}
        <PortalSidebar />

        {/* Inset Main Content Area */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Modern Top Header */}
          <PortalHeader />

          {/* Main Content Viewport */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
