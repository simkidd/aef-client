"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { PortalSidebar } from "./PortalSidebar";
import { useAuthStore } from "@/stores/auth.store";
import {
  Bell,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Award,
  Calendar,
  FileText,
  User,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Dynamic breadcrumb label
  const getPageInfo = () => {
    switch (pathname) {
      case "/portal":
        return { title: "Dashboard", icon: Compass };
      case "/portal/programs":
        return { title: "Empowerment Programs", icon: Sparkles };
      case "/portal/applications":
        return { title: "My Applications", icon: FileText };
      case "/portal/training":
        return { title: "Live Training & Attendance", icon: GraduationCap };
      case "/portal/timetable":
        return { title: "Schedule & Timetable", icon: Clock };
      case "/portal/certificates":
        return { title: "My Certificates & Badges", icon: Award };
      case "/portal/profile":
        return { title: "Beneficiary Profile & NIN", icon: User };
      default:
        return { title: "Beneficiary Portal", icon: Compass };
    }
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50/70 dark:bg-slate-950">
        {/* Modern Collapsible Shadcn Sidebar */}
        <PortalSidebar />

        {/* Inset Main Dashboard Area */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Top Inset Bar */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="md:hidden h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-lg" />

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary">
                  <PageIcon className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {pageInfo.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Quick Actions / Role Pills */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user?.isStaff && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin")}
                  className="gap-1.5 text-xs font-semibold text-primary border-primary/20 bg-primary/10 hover:bg-primary/15 dark:bg-primary/15 dark:text-primary hidden sm:flex"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                  Staff Operations
                </Button>
              )}

              <ThemeToggle />

              <div className="flex items-center gap-2 pl-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[10px] font-medium text-primary dark:text-primary">
                    Active Beneficiary
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-linear-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.firstName?.[0] || "B"}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Viewport */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
