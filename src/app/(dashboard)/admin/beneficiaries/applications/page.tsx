import React, { Suspense } from "react";
import { Metadata } from "next";
import { BeneficiariesHubView } from "@/components/admin/beneficiaries";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Applications Review Pipeline | Adele Foundation Admin",
  description:
    "Review incoming candidate applications and route approved candidates to the physical verification queue.",
};

export default function ApplicationsPipelinePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <BeneficiariesHubView defaultTab="applications" />
    </Suspense>
  );
}

