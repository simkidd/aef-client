import React, { Suspense } from "react";
import { Metadata } from "next";
import { ProgramsHubView } from "@/components/admin/programs";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Programs & Curriculum Hub | Adele Foundation Admin",
  description:
    "Manage Adele Foundation vocational empowerment programs, skill disciplines, and multi-skill training cohorts.",
};

export default function AdminProgramsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <ProgramsHubView />
    </Suspense>
  );
}

