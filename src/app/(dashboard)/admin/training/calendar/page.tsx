import React from "react";
import { Metadata } from "next";
import { TrainingCalendarView } from "@/components/admin/training";

export const metadata: Metadata = {
  title: "Training Calendar & Exception Manager | Adele Foundation Admin",
  description:
    "Configure non-training dates, public holidays, emergency centre closures, and attendance exemptions.",
};

export default function AdminCalendarPage() {
  return <TrainingCalendarView />;
}
