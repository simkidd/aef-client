import React from "react";
import { Metadata } from "next";
import { DailyAttendanceSheetView } from "@/components/admin/training";

export const metadata: Metadata = {
  title: "Daily Attendance Sheet & Corrections | Adele Foundation Admin",
  description:
    "Review biometric attendance records, late arrivals, grace period policies, and auditable manual corrections.",
};

export default function AdminAttendancePage() {
  return <DailyAttendanceSheetView />;
}
