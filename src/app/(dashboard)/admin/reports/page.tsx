import React from "react";
import { Metadata } from "next";
import { ReportsAndImpactView } from "@/components/admin/reports";

export const metadata: Metadata = {
  title: "Reports & Impact Metrics | Adele Foundation Admin",
  description:
    "Institutional statistics tracking demographic reach, female technical inclusion, training completions, and centre capacity.",
};

export default function AdminReportsPage() {
  return <ReportsAndImpactView />;
}
