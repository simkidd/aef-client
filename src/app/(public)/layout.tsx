import React from "react";
import { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "Adele Empowerment Foundation | Vocational Skills & Youth Development NGO",
  description:
    "Adele Empowerment Foundation is a registered non-profit NGO providing tuition-free accredited vocational training, digital bootcamps, and starter kits to empower youth across Nigeria.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Human-designed authentic NGO header */}
      <PublicHeader />

      {/* Main page view */}
      <main className="flex-1">{children}</main>

      {/* Institutional NGO footer */}
      <PublicFooter />
    </div>
  );
}
