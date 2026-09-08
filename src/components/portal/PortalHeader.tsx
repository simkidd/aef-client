"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  FileText,
  Clock,
  Award,
  User,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { useAuthStore } from "@/stores/auth.store";

export function PortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  // Dynamic breadcrumb label and icon based on current path
  const getPageInfo = () => {
    if (pathname.startsWith("/portal/programs/")) {
      return { title: "Program Details", icon: Sparkles };
    }
    switch (pathname) {
      case "/portal":
        return { title: "Dashboard", icon: Compass };
      case "/portal/programs":
        return { title: "Browse Programs", icon: Sparkles };
      case "/portal/applications":
        return { title: "My Applications", icon: FileText };
      case "/portal/training":
        return { title: "Live Training & Attendance", icon: GraduationCap };
      case "/portal/timetable":
        return { title: "Schedule & Timetable", icon: Clock };
      case "/portal/certificates":
        return { title: "My Certificates & Badges", icon: Award };
      case "/portal/profile":
        return { title: "My Profile", icon: User };
      default:
        return { title: "Beneficiary Portal", icon: Compass };
    }
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      {/* Left: Mobile Sidebar Trigger + Page Title Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-lg cursor-pointer" />

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary">
            <PageIcon className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight font-heading">
              {pageInfo.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Staff Switch, Notifications, Theme Toggle, User Profile */}
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

        {/* Notifications & Announcements Dropdown */}
        <NotificationDropdown />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Pill / Profile Shortcut */}
        <Link
          href="/portal/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
        >
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
              {user?.email || "Beneficiary"}
            </span>
          </div>
          <div className="h-8 w-8 rounded-xl bg-linear-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.firstName?.[0] || "B"}
          </div>
        </Link>
      </div>
    </header>
  );
}
