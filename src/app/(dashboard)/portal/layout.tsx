import { Metadata } from "next";
import { PortalLayout } from "@/components/portal/PortalLayout";

export const metadata: Metadata = {
  title: "Beneficiary Portal | Adele Foundation",
  description: "Candidate learning, live timetable, biometric attendance, and certifications",
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout>{children}</PortalLayout>;
}
