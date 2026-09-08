import React from "react";
import { Metadata } from "next";
import { MyApplicationsView } from "@/components/portal/applications";

export const metadata: Metadata = {
  title: "My Applications | Adele Beneficiary Portal",
  description:
    "Track the full lifecycle of your program applications from submission to selection and biometric registration.",
};

export default function MyApplicationsPage() {
  return <MyApplicationsView />;
}
