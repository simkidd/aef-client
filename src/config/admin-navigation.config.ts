import React from "react";
import {
  LayoutDashboard,
  Users,
  Handshake,
  MapPin,
  FileText,
  Briefcase,
  Sparkles,
  GraduationCap,
  UserCheck,
  Clock,
  Fingerprint,
  Award,
  BarChart3,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  description?: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Organisation",
    items: [
      {
        label: "Staff Members",
        href: "/admin/organization/staff",
        icon: Users,
        permission: "staff:view",
      },
      {
        label: "Training Centres",
        href: "/admin/organization/centres",
        icon: MapPin,
        permission: "centres:view",
      },
      {
        label: "Partners & Sponsors",
        href: "/admin/organization/partners",
        icon: Handshake,
        permission: "partners:view",
      },
    ],
  },
  {
    group: "Programs",
    items: [
      {
        label: "Training Programs",
        href: "/admin/programs",
        icon: Briefcase,
      },
      {
        label: "Skills & Trades",
        href: "/admin/programs/skills",
        icon: Sparkles,
      },
      {
        label: "Training Cohorts",
        href: "/admin/programs/cohorts",
        icon: GraduationCap,
      },
    ],
  },
  {
    group: "Beneficiaries",
    items: [
      {
        label: "Applications",
        href: "/admin/beneficiaries/applications",
        icon: FileText,
        permission: "applicants:view",
      },
      {
        label: "Enrollment",
        href: "/admin/beneficiaries/enrollment",
        icon: UserCheck,
        permission: "enrollment:manage",
      },
      {
        label: "Trainees",
        href: "/admin/beneficiaries/trainees",
        icon: Users,
        permission: "beneficiaries:view",
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        label: "Class Schedule",
        href: "/admin/training/timetable",
        icon: Clock,
      },
      {
        label: "Attendance",
        href: "/admin/training/attendance",
        icon: UserCheck,
        permission: "attendance:view",
      },
      {
        label: "Biometrics",
        href: "/admin/training/biometrics",
        icon: Fingerprint,
        permission: "biometrics:view",
      },
      {
        label: "Certificates",
        href: "/admin/training/certificates",
        icon: Award,
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        label: "Reports & Analytics",
        href: "/admin/reports",
        icon: BarChart3,
        permission: "reports:view",
      },
      {
        label: "User Permissions",
        href: "/admin/settings/roles",
        icon: ShieldCheck,
        permission: "users:manage",
      },
      {
        label: "System Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

/** Flattened list of all registered admin navigation items */
export const ALL_ADMIN_NAV_ITEMS = ADMIN_NAV_GROUPS.flatMap((g) => g.items);

/** Route path to required permission lookup map */
export const ROUTE_PERMISSION_MAP: Record<
  string,
  { permission: string; label: string }
> = ALL_ADMIN_NAV_ITEMS.reduce((acc, item) => {
  if (item.permission) {
    acc[item.href] = { permission: item.permission, label: item.label };
  }
  return acc;
}, {} as Record<string, { permission: string; label: string }>);
