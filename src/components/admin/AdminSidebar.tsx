"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Handshake,
  MapPin,
  Layers,
  FileText,
  Boxes,
  GraduationCap,
  Sparkles,
  Calendar,
  Clock,
  Fingerprint,
  Radio,
  Award,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useLogout";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Organization",
    items: [
      {
        label: "Staff Directory",
        href: "/admin/organization/staff",
        icon: Users,
        permission: "staff:view",
      },
      {
        label: "Departments",
        href: "/admin/organization/departments",
        icon: Building2,
      },
      {
        label: "Volunteers",
        href: "/admin/organization/volunteers",
        icon: UserCheck,
      },
      {
        label: "Partners & Sponsors",
        href: "/admin/organization/partners",
        icon: Handshake,
      },
      {
        label: "Training Centres",
        href: "/admin/organization/centres",
        icon: MapPin,
      },
      {
        label: "Rooms & Facilities",
        href: "/admin/organization/facilities",
        icon: Layers,
      },
      {
        label: "Physical Assets",
        href: "/admin/organization/assets",
        icon: Boxes,
      },
      {
        label: "Documents Repository",
        href: "/admin/organization/documents",
        icon: FileText,
      },
    ],
  },
  {
    group: "Programs & Curriculums",
    items: [
      { label: "Programs Catalog", href: "/admin/programs", icon: Briefcase },
      {
        label: "Skill Areas Registry",
        href: "/admin/programs/skills",
        icon: Sparkles,
      },
      {
        label: "Cohorts & Capacities",
        href: "/admin/programs/cohorts",
        icon: GraduationCap,
      },
    ],
  },
  {
    group: "Beneficiary Management",
    items: [
      {
        label: "Applications Pipeline",
        href: "/admin/beneficiaries/applications",
        icon: FileText,
        permission: "applicants:view",
      },
      {
        label: "Verification & Enrollment",
        href: "/admin/beneficiaries/enrollment",
        icon: UserCheck,
        permission: "enrollment:manage",
      },
      {
        label: "Active Trainees",
        href: "/admin/beneficiaries/trainees",
        icon: Users,
        permission: "beneficiaries:view",
      },
    ],
  },
  {
    group: "Training Operations",
    items: [
      {
        label: "Timetable & Sessions",
        href: "/admin/training/timetable",
        icon: Clock,
      },
      {
        label: "Calendar Exceptions",
        href: "/admin/training/calendar",
        icon: Calendar,
      },
      {
        label: "Daily Attendance Sheet",
        href: "/admin/training/attendance",
        icon: UserCheck,
        permission: "attendance:view",
      },
      {
        label: "Biometric Devices & Scans",
        href: "/admin/training/biometrics",
        icon: Fingerprint,
        permission: "biometrics:view",
      },
      {
        label: "Assessments & Grades",
        href: "/admin/training/assessments",
        icon: Award,
      },
      {
        label: "Certificates Registry",
        href: "/admin/training/certificates",
        icon: Award,
      },
    ],
  },
  {
    group: "Insights & Compliance",
    items: [
      {
        label: "Reports & Impact Metrics",
        href: "/admin/reports",
        icon: BarChart3,
        permission: "reports:view",
      },
      {
        label: "Audit Trail Explorer",
        href: "/admin/audit-logs",
        icon: History,
        permission: "audit:view",
      },
      {
        label: "Users & RBAC Matrix",
        href: "/admin/settings/roles",
        icon: ShieldCheck,
        permission: "users:manage",
      },
      { label: "System Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const ALL_HREFS = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user, hasPermission } = useAuthStore();
  const [mounted, setMounted] = useState(false);

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

  const isItemActive = (href: string) => {
    if (pathname === href) return true;
    if (href === "/admin") return false;

    if (pathname.startsWith(href + "/")) {
      const hasMoreSpecificMatch = ALL_HREFS.some(
        (otherHref) =>
          otherHref !== href &&
          otherHref.length > href.length &&
          (pathname === otherHref || pathname.startsWith(otherHref + "/")),
      );
      return !hasMoreSpecificMatch;
    }
    return false;
  };

  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-slate-100 dark:border-slate-900">
        <Link
          href="/admin"
          onClick={closeMobileSidebar}
          className="flex items-center gap-3 group"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-slate-100 dark:border-slate-800">
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
              AEF
            </span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest dark:text-primary mt-1">
              Admin Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className="px-2 py-2 space-y-2">
        {!mounted
          ? [
              { id: "s1", count: 1, labelWidth: "w-16" },
              { id: "s2", count: 4, labelWidth: "w-24" },
              { id: "s3", count: 3, labelWidth: "w-28" },
              { id: "s4", count: 3, labelWidth: "w-32" },
            ].map((section) => (
              <SidebarGroup key={section.id} className="p-0">
                <div className="px-2.5 h-7 flex items-center">
                  <Skeleton
                    className={`h-2.5 ${section.labelWidth} rounded-sm`}
                  />
                </div>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {Array.from({ length: section.count }).map((_, i) => (
                      <SidebarMenuItem key={i}>
                        <SidebarMenuSkeleton showIcon />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          : NAV_GROUPS.map((group) => {
              const visibleItems = group.items.filter(
                (item) => !item.permission || hasPermission(item.permission),
              );
              if (visibleItems.length === 0) return null;

              return (
                <SidebarGroup key={group.group} className="p-0">
                  <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 h-7">
                    {group.group}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5">
                      {visibleItems.map((item) => {
                        const isActive = isItemActive(item.href);
                        const Icon = item.icon;

                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              render={
                                <Link
                                  href={item.href}
                                  onClick={closeMobileSidebar}
                                />
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
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
      </SidebarContent>

      {/* Sidebar Footer: User Card */}
      <SidebarFooter className="p-3 border-t border-slate-100 dark:border-slate-900">
        {!mounted || !user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user?.firstName?.[0] || "A"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Staff Member"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.roles?.[0] || "Administrator"}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={openLogoutModal}
              title="Log Out"
              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log Out</span>
            </Button>
          </div>
        )}
      </SidebarFooter>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="Sign out of Adele Foundation Admin?"
        description="Are you sure you want to log out? You will need to sign in again to access the operations portal."
        confirmText="Yes, Log Out"
        cancelText="Stay Signed In"
        variant="destructive"
        icon={LogOut}
        isLoading={isLoggingOut}
      />
    </Sidebar>
  );
}
