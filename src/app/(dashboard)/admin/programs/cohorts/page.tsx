import React from "react";
import { Metadata } from "next";
import { CohortsManagementView } from "@/components/admin/programs/cohorts";

export const metadata: Metadata = {
  title: "Cohorts & Capacity Slot Management | Adele Foundation Admin",
  description:
    "Configure multi-skill training cohorts per centre, manage capacity slots, timetable schedules, and training session logistics.",
};

export default function AdminCohortsPage() {
  return <CohortsManagementView />;
}
