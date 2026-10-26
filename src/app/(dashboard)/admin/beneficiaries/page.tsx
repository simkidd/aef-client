import React, { Suspense } from "react";
import { Metadata } from "next";
import { BeneficiariesHubView } from "@/components/admin/beneficiaries";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Beneficiaries Lifecycle & Pipeline | Adele Foundation Admin",
  description:
    "Unified management of applicants, physical verification & biometric enrollment, and active trainees across cohorts.",
};

export default function BeneficiariesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <BeneficiariesHubView />
    </Suspense>
  );
}
