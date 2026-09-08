import React from "react";
import { Metadata } from "next";
import { MyTrainingJourneyView } from "@/components/portal/training";

export const metadata: Metadata = {
  title: "My Training Journey | Adele Beneficiary Portal",
  description:
    "Complete lifelong record of your vocational training enrollments, biometric clock-ins, attendance history, and certifications.",
};

export default function MyTrainingJourneyPage() {
  return <MyTrainingJourneyView />;
}
