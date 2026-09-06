import React from "react";
import { Metadata } from "next";
import { AssessmentsManagementView } from "@/components/admin/training";

export const metadata: Metadata = {
  title: "Assessments & Gradebook | Adele Foundation Admin",
  description:
    "Record practical and theory competency evaluations, pass/fail thresholds, and gradebook results.",
};

export default function AdminAssessmentsPage() {
  return <AssessmentsManagementView />;
}
