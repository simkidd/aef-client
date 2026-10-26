import React, { Suspense } from "react";
import { Metadata } from "next";
import { AssessmentsManagementView } from "@/components/admin/training";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Assessments & Grading | Adele Foundation Admin",
  description:
    "Manage technical skills evaluations, tests, practical exams, and batch trainee grade entries across cohorts.",
};

export default function AdminAssessmentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <AssessmentsManagementView />
    </Suspense>
  );
}
