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
  Camera,
  ClipboardCheck,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string | string[];
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
        label: "Programs & Curriculum",
        href: "/admin/programs",
        icon: Briefcase,
        permission: ["programs:view", "skills:manage", "cohorts:view"],
        description: "Programs, Skills & Training Cohorts",
      },
    ],
  },
  {
    group: "Beneficiaries",
    items: [
      {
        label: "Beneficiary Pipeline",
        href: "/admin/beneficiaries",
        icon: Users,
        permission: ["applicants:view", "enrollment:manage", "beneficiaries:view"],
        description: "Applications, Enrollment Desk & Active Trainees",
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
        label: "Attendance & Biometrics",
        href: "/admin/training/attendance",
        icon: UserCheck,
        permission: ["attendance:view", "biometrics:view"],
      },
      {
        label: "Assessments & Grading",
        href: "/admin/training/assessments",
        icon: ClipboardCheck,
        permission: ["assessments:manage", "results:enter"],
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
        label: "User Accounts",
        href: "/admin/settings/users",
        icon: Users,
        permission: "users:manage",
      },
      {
        label: "Roles & Permissions",
        href: "/admin/settings/roles",
        icon: ShieldCheck,
        permission: "users:manage",
      },
      {
        label: "Photo Gallery",
        href: "/admin/gallery",
        icon: Camera,
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
  { permission: string | string[]; label: string }
> = ALL_ADMIN_NAV_ITEMS.reduce((acc, item) => {
  if (item.permission) {
    acc[item.href] = { permission: item.permission, label: item.label };
  }
  return acc;
}, {} as Record<string, { permission: string | string[]; label: string }>);

// Ensure legacy subroutes maintain permission guards
ROUTE_PERMISSION_MAP["/admin/beneficiaries/applications"] = {
  permission: "applicants:view",
  label: "Applications",
};
ROUTE_PERMISSION_MAP["/admin/beneficiaries/enrollment"] = {
  permission: "enrollment:manage",
  label: "Enrollment",
};
ROUTE_PERMISSION_MAP["/admin/beneficiaries/trainees"] = {
  permission: "beneficiaries:view",
  label: "Trainees",
};
ROUTE_PERMISSION_MAP["/admin/training/biometrics"] = {
  permission: "biometrics:view",
  label: "Biometrics",
};
ROUTE_PERMISSION_MAP["/admin/training/assessments"] = {
  permission: ["assessments:manage", "results:enter"],
  label: "Assessments & Grading",
};
ROUTE_PERMISSION_MAP["/admin/programs/skills"] = {
  permission: "skills:manage",
  label: "Skills & Trades",
};
ROUTE_PERMISSION_MAP["/admin/programs/cohorts"] = {
  permission: "cohorts:view",
  label: "Training Cohorts",
};
