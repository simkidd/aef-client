import React, { Suspense } from "react";
import { Metadata } from "next";
import { AttendanceHubView } from "@/components/admin/training";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Biometric Infrastructure & Raw Scans | Adele Foundation Admin",
  description:
    "Live scanner hardware monitor, unknown scan triage, and real-time event stream from training centre gates.",
};

export default function AdminBiometricsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <AttendanceHubView defaultTab="biometrics" />
    </Suspense>
  );
}

