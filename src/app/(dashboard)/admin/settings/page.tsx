import React from "react";
import { Metadata } from "next";
import { AdminSettingsView } from "@/components/admin/settings";

export const metadata: Metadata = {
  title: "System & Organization Settings | Adele Foundation Admin",
  description:
    "Configure foundation legal profile, contact information, operational rules, and biometric attendance criteria.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
