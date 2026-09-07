import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date | undefined | null,
  includeTime: boolean = false,
): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  if (includeTime) {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: string | Date | undefined | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDuration(minutes: number | undefined | null): string {
  if (!minutes || minutes <= 0) return "—";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (hrs > 0) {
    return `${hrs}h`;
  }
  return `${mins}m`;
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCurrency(
  amount: number,
  currency: string = "NGN",
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const normalized = status?.toLowerCase().replace(/_/g, " ").trim();

  switch (normalized) {
    // Success / Active States (Semantic Green)
    case "active":
    case "approved":
    case "completed":
    case "present":
    case "passed":
    case "enrolling":
    case "selected":
    case "online":
    case "biometric registered":
    case "biometric registration":
    case "enrollment confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";

    // Informational / In-Progress States
    case "upcoming":
    case "in progress":
    case "shortlisted":
    case "syncing":
    case "assigned to cohort":
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800";

    // Evaluation / Assessments States (Semantic Violet)
    case "assessments":
    case "assessment":
    case "evaluation":
    case "examination":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800";

    // Submitted / New
    case "submitted":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";

    // Warning / Pending Review / Attention Needed States
    case "pending":
    case "under review":
    case "pending verification":
    case "awaiting verification":
    case "awaiting biometric":
    case "verification issue":
    case "late":
    case "partial":
    case "incomplete":
    case "maintenance":
    case "under maintenance":
    case "suspended":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";

    // Error / Rejection / Inactive States
    case "rejected":
    case "not selected":
    case "failed":
    case "absent":
    case "offline":
    case "inactive":
    case "dropped":
    case "withdrawn":
    case "cancelled":
    case "did not complete enrollment":
    case "expired":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";

    // Neutral / Draft / Archived States
    case "draft":
    case "archived":
    case "closed":
    case "excused":
    case "transferred":
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
  }
}
