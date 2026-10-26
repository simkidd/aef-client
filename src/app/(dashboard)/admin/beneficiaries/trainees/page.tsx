import React, { Suspense } from "react";
import { Metadata } from "next";
import { BeneficiariesHubView } from "@/components/admin/beneficiaries";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Active Enrolled Trainees | Adele Foundation Admin",
  description:
    "Directory of active beneficiaries enrolled and undergoing practical training across cohorts and centres.",
};

export default function ActiveTraineesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <BeneficiariesHubView defaultTab="trainees" />
    </Suspense>
  );
}

