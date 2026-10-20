import React from "react";
import { Metadata } from "next";
import CertificateVerifyView from "@/components/verify/CertificateVerifyView";

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Verify Certificate #${code} | Adele Empowerment Foundation`,
    description: "Official credential verification portal for Adele Empowerment Foundation accredited graduates.",
  };
}

export default async function PublicVerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params;
  return <CertificateVerifyView code={code} />;
}
