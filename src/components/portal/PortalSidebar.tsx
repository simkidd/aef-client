"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  GraduationCap,
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
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useLogout";
import {
  useMyTrainingJourneyQuery,
  useMyCertificatesQuery,
} from "@/hooks";

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Progressive disclosure query data
  const { data: trainingData } = useMyTrainingJourneyQuery();
  const { data: certificates } = useMyCertificatesQuery();

  const isEnrolledOrTrained = Boolean(
    trainingData?.active || (trainingData?.history && trainingData.history.length > 0)
  );

  const hasCertificates = Boolean(
    (Array.isArray(certificates) && certificates.length > 0) ||
    (trainingData?.history && trainingData.history.length > 0)
  );

  const {
    isOpen: isLogoutOpen,
    openLogoutModal,
    closeLogoutModal,
    isLoggingOut,
    handleLogout,
  } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const navItems = useMemo(() => {
    const items = [
      { label: "Dashboard", href: "/portal", icon: Compass },
      { label: "Browse Programs", href: "/portal/programs", icon: Sparkles },
      { label: "My Applications", href: "/portal/applications", icon: FileText },
    ];

    // Unlock Live Training & Timetable when enrolled in a cohort
    if (isEnrolledOrTrained) {
      items.push({ label: "Live Training", href: "/portal/training", icon: GraduationCap });
      items.push({ label: "Timetable", href: "/portal/timetable", icon: Clock });
    }

    // Unlock Certificates once completed/awarded
    if (hasCertificates) {
      items.push({ label: "Certificates", href: "/portal/certificates", icon: Award });
    }

    // Always available
    items.push({ label: "My Profile", href: "/portal/profile", icon: User });

    return items;
  }, [isEnrolledOrTrained, hasCertificates]);

  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-slate-100 dark:border-slate-900">
        <Link
          href="/portal"
          onClick={closeMobileSidebar}
          className="flex items-center gap-3 group"
        >
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

      {/* Main Navigation - Single sleek unified list */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={
                    <Link href={item.href} onClick={closeMobileSidebar} />
                  }
                  isActive={isActive}
                  tooltip={item.label}
                  onClick={closeMobileSidebar}
                  className={
                    isActive
                      ? "bg-primary/10 text-primary! font-semibold border border-primary/20 shadow-2xs dark:bg-primary/15 dark:text-primary dark:border-primary/30"
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

        {/* Staff Switch if user is staff (waits for hydration) */}
        {mounted && user?.isStaff && (
          <SidebarGroup className="mt-auto p-0">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary px-2.5 h-7">
              Staff Portal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      closeMobileSidebar();
                      router.push("/admin");
                    }}
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
        {!mounted || !user ? (
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          </div>
        ) : (
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
              onClick={openLogoutModal}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="Sign out of Adele Beneficiary Portal?"
        description="Are you sure you want to log out? You will need to sign in again to access your applications, certificates, and training schedule."
        confirmText="Yes, Log Out"
        cancelText="Stay Signed In"
        variant="destructive"
        icon={LogOut}
        isLoading={isLoggingOut}
      />
    </Sidebar>
  );
}
