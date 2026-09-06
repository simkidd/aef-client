import React from "react";
import { Metadata } from "next";
import { CertificatesRegistryView } from "@/components/admin/training";

export const metadata: Metadata = {
  title: "Certificates & Credentials Registry | Adele Foundation Admin",
  description:
    "Official issued certificates with cryptographic public verification tokens and QR validation.",
};

export default function AdminCertificatesPage() {
  return <CertificatesRegistryView />;
}
