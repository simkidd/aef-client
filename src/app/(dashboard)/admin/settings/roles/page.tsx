import React from "react";
import { Metadata } from "next";
import { RolesPermissionsMatrixView } from "@/components/admin/settings/roles";

export const metadata: Metadata = {
  title: "Roles & RBAC Matrix | Adele Foundation Admin",
  description:
    "Configure system authorization roles, granular action permissions, and spatial scope assignments.",
};

export default function AdminRolesSettingsPage() {
  return <RolesPermissionsMatrixView />;
}
