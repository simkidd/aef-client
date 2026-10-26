import React, { Suspense } from "react";
import { Metadata } from "next";
import { BeneficiariesHubView } from "@/components/admin/beneficiaries";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Physical Verification & Biometric Desk | Adele Foundation Admin",
  description:
    "Physical document verification and biometric fingerprint capture desk for admitted beneficiaries.",
};

export default function BiometricRegistrationDeskPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <BeneficiariesHubView defaultTab="enrollment" />
    </Suspense>
  );
}

