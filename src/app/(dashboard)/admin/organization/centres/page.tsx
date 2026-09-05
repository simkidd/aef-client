import React from "react";
import { Metadata } from "next";
import { CentresManagementView } from "@/components/admin/centres";

export const metadata: Metadata = {
  title: "Training Centres & Facilities | Adele Foundation Admin",
  description:
    "Centrally manage accredited Adele Foundation training centres, facilities, biometric devices, and room capacities.",
};

export default function TrainingCentresPage() {
  return <CentresManagementView />;
}
