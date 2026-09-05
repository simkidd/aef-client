import React from "react";
import { Metadata } from "next";
import { BiometricRegistrationDeskView } from "@/components/admin/beneficiaries/enrollment";

export const metadata: Metadata = {
  title: "Physical Verification & Biometric Desk | Adele Foundation Admin",
  description:
    "Physical document verification and biometric fingerprint capture desk for admitted beneficiaries.",
};

export default function BiometricRegistrationDeskPage() {
  return <BiometricRegistrationDeskView />;
}
