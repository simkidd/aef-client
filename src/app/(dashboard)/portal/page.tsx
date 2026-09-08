import React from "react";
import { Metadata } from "next";
import { BeneficiaryDashboardView } from "@/components/portal/BeneficiaryDashboardView";

export const metadata: Metadata = {
  title: "My Portal | Adele Foundation",
  description:
    "Beneficiary dashboard — track your applications, active training, attendance, and announcements.",
};

export default function BeneficiaryDashboardPage() {
  return <BeneficiaryDashboardView />;
}
