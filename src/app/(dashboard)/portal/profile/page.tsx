import React from "react";
import { Metadata } from "next";
import { PortalProfileView } from "@/components/portal/profile";

export const metadata: Metadata = {
  title: "My Profile | Adele Beneficiary Portal",
  description:
    "Your permanent beneficiary profile — demographic records, biometric identity, and institutional history.",
};

export default function PortalProfilePage() {
  return <PortalProfileView />;
}
