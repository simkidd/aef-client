import React from "react";
import { Metadata } from "next";
import { PortalCertificatesView } from "@/components/portal/certificates";

export const metadata: Metadata = {
  title: "My Certificates | Adele Beneficiary Portal",
  description:
    "Official accredited certificates issued by Adele Empowerment Foundation with cryptographic verification tokens.",
};

export default function PortalCertificatesPage() {
  return <PortalCertificatesView />;
}
