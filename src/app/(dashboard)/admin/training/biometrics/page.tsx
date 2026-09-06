import React from "react";
import { Metadata } from "next";
import { BiometricsManagementView } from "@/components/admin/training";

export const metadata: Metadata = {
  title: "Biometric Infrastructure & Raw Scans | Adele Foundation Admin",
  description:
    "Live scanner hardware monitor, unknown scan triage, and real-time event stream from training centre gates.",
};

export default function AdminBiometricsPage() {
  return <BiometricsManagementView />;
}
