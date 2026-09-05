import React from "react";
import { Metadata } from "next";
import { ActiveTraineesView } from "@/components/admin/beneficiaries/trainees";

export const metadata: Metadata = {
  title: "Active Enrolled Trainees | Adele Foundation Admin",
  description:
    "Directory of active beneficiaries enrolled and undergoing practical training across cohorts and centres.",
};

export default function ActiveTraineesPage() {
  return <ActiveTraineesView />;
}
