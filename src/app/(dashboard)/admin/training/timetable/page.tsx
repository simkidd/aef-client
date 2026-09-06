import React from "react";
import { Metadata } from "next";
import { TimetableManagementView } from "@/components/admin/training";

export const metadata: Metadata = {
  title: "Timetable & Sessions Matrix | Adele Foundation Admin",
  description:
    "Manage dynamic training timetables, session rosters, facilitators, and scheduling for cohorts.",
};

export default function AdminTimetablePage() {
  return <TimetableManagementView />;
}
