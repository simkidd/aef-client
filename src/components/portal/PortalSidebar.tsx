"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  FileText,
  Clock,
  Award,
  User,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "../ui/sidebar";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "@/lib/api/auth.api";

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  };

  const mainNavItems = [
    { label: "Dashboard", href: "/portal", icon: Compass },
    { label: "Browse Programs", href: "/portal/programs", icon: Sparkles },
    { label: "My Applications", href: "/portal/applications", icon: FileText },
    { label: "Live Training", href: "/portal/training", icon: GraduationCap },
    { label: "Timetable", href: "/portal/timetable", icon: Clock },
    { label: "Certificates", href: "/portal/certificates", icon: Award },
  ];

  const profileNavItems = [
    { label: "My Profile & NIN", href: "/portal/profile", icon: User },
  ];

  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-slate-100 dark:border-slate-900">
        <Link href="/portal" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900 group-hover:scale-105 transition-transform">
            <Image
              src="/logos/adele-logo.png"
              alt="Adele Empowerment Foundation"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate font-heading">
              ADELE FOUNDATION
            </span>
            <span className="text-[11px] font-medium text-primary dark:text-primary mt-1">
              Beneficiary Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="p-2 space-y-4">
        {/* Trainee Learning Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Training & Programs
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-2xs dark:bg-primary/15 dark:text-primary dark:border-primary/30"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                      }
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-primary dark:text-primary"
                            : "text-slate-400 group-hover/menu-button:text-slate-600 dark:text-slate-500 dark:group-hover/menu-button:text-slate-300"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-1 border-slate-100 dark:border-slate-900" />

        {/* Identity & Verification */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Identity & Verification
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-2xs dark:bg-primary/15 dark:text-primary dark:border-primary/30"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                      }
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-primary dark:text-primary"
                            : "text-slate-400 group-hover/menu-button:text-slate-600 dark:text-slate-500 dark:group-hover/menu-button:text-slate-300"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/verify/aef-verify-7c9e12bf4089a8c"
                      target="_blank"
                    />
                  }
                  tooltip="Certificate Verification"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900"
                >
                  <ShieldCheck className="h-4 w-4 text-primary dark:text-primary shrink-0" />
                  <span className="truncate">Public Verification</span>
                  <ExternalLink className="ml-auto h-3 w-3 text-slate-400" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Staff Switch if user is staff */}
        {user?.isStaff && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary px-3">
              Staff Portal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => router.push("/admin")}
                    className="text-primary bg-primary/10 hover:bg-primary/15 dark:bg-primary/15 dark:text-primary dark:hover:bg-emerald-950"
                  >
                    <ShieldAlert className="h-4 w-4 text-primary dark:text-primary shrink-0" />
                    <span className="truncate font-semibold">
                      Staff Operations
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Sidebar Footer: User Card & Sign Out */}
      <SidebarFooter className="p-3 border-t border-slate-100 dark:border-slate-900">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {user?.firstName?.[0] || "B"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
