import React from "react";
import { Metadata } from "next";
import { PortalTimetableView } from "@/components/portal/timetable";

export const metadata: Metadata = {
  title: "Training Timetable | Adele Beneficiary Portal",
  description:
    "Your official class schedule, assigned workshops, trainer assignments, and training calendar exceptions.",
};

export default function PortalTimetablePage() {
  return <PortalTimetableView />;
}
