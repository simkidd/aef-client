import React from "react";
import { Metadata } from "next";
import { PortalProgramsView } from "@/components/portal/programs";

export const metadata: Metadata = {
  title: "Empowerment Programs | Adele Beneficiary Portal",
  description:
    "Browse and apply to vocational empowerment programs and government-sponsored technical training initiatives.",
};

export default function PortalProgramsPage() {
  return <PortalProgramsView />;
}
