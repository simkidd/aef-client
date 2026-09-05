import React from "react";
import { Metadata } from "next";
import { StaffDirectoryView } from "@/components/admin/staff";

export const metadata: Metadata = {
  title: "Staff & Employee Directory | Adele Foundation Admin",
  description:
    "Organization HR registry for all employees (Trainers, Management, Operations, Cleaners, Drivers).",
};

export default function StaffDirectoryPage() {
  return <StaffDirectoryView />;
}
