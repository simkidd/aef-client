import React, { Suspense } from "react";
import { Metadata } from "next";
import { AttendanceHubView } from "@/components/admin/training";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Attendance & Biometrics Hub | Adele Foundation Admin",
  description:
    "Review biometric attendance records, late arrivals, grace period policies, turnstile hardware telemetry, and auditable manual corrections.",
};

export default function AdminAttendancePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <AttendanceHubView />
    </Suspense>
  );
}

