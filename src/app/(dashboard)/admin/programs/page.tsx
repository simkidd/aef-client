import React from "react";
import { Metadata } from "next";
import { ProgramsManagementView } from "@/components/admin/programs";

export const metadata: Metadata = {
  title: "Programs & Initiatives | Adele Foundation Admin",
  description:
    "Manage Adele Foundation vocational empowerment programs, partner-sponsored initiatives, and integrated skill tracks.",
};

export default function AdminProgramsPage() {
  return <ProgramsManagementView />;
}
