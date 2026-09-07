import React from "react";
import { Metadata } from "next";
import { AuditTrailExplorerView } from "@/components/admin/audit-logs";

export const metadata: Metadata = {
  title: "Audit Trail Explorer | Adele Foundation Admin",
  description:
    "Explore immutable forensic audit records, administrative mutations, and state differences across the foundation.",
};

export default function AdminAuditLogsPage() {
  return <AuditTrailExplorerView />;
}
