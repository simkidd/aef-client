import React from "react";
import { Metadata } from "next";
import { ApplicationsPipelineView } from "@/components/admin/beneficiaries/applications";

export const metadata: Metadata = {
  title: "Applications Review Pipeline | Adele Foundation Admin",
  description:
    "Review incoming candidate applications and route approved candidates to the physical verification queue.",
};

export default function ApplicationsPipelinePage() {
  return <ApplicationsPipelineView />;
}
