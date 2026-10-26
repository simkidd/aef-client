import React, { Suspense } from "react";
import { Metadata } from "next";
import { ProgramsHubView } from "@/components/admin/programs";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Cohorts & Capacity Slot Management | Adele Foundation Admin",
  description:
    "Configure multi-skill training cohorts per centre, manage capacity slots, timetable schedules, and training session logistics.",
};

export default function AdminCohortsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <ProgramsHubView defaultTab="cohorts" />
    </Suspense>
  );
}

