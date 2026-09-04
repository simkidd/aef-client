"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Award,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
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

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, hasPermission } = useAuthStore();

  const navGroups: NavGroup[] = [
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

  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      {/* Brand Header */}
      <SidebarHeader className="p-4 border-b border-slate-100 dark:border-slate-900">
        <Link href="/admin" className="flex items-center gap-3 group">
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
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest dark:text-emerald-400 mt-1">
              Operations OS v2.0
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className="p-2 space-y-4">
        {navGroups.map((group, groupIndex) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || hasPermission(item.permission),
          );
          if (visibleItems.length === 0) return null;

          return (
            <React.Fragment key={group.group}>
              {groupIndex > 0 && (
                <SidebarSeparator className="my-1 border-slate-100 dark:border-slate-900" />
              )}
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
                  {group.group}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" &&
                          pathname.startsWith(item.href));
                      const Icon = item.icon;

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            render={<Link href={item.href} />}
                            isActive={isActive}
                            tooltip={item.label}
                            className={
                              isActive
                                ? "bg-teal-50 text-teal-900 font-semibold dark:bg-teal-950/60 dark:text-teal-200"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900"
                            }
                          >
                            <Icon
                              className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-700 dark:text-teal-400" : "text-slate-500"}`}
                            />
                            <span className="truncate">{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </React.Fragment>
          );
        })}
      </SidebarContent>

      {/* Sidebar Footer: User Card */}
      <SidebarFooter className="p-3 border-t border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
          <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-teal-800 to-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
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
      </SidebarFooter>
    </Sidebar>
  );
}
