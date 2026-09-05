import React from "react";
import { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Operations & Executive Dashboard | Adele Foundation Admin",
  description:
    "Real-time central operational metrics across Adele training centres, multi-skill cohorts, and biometric attendance.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
