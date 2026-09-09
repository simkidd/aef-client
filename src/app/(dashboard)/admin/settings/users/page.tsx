import React from "react";
import { AdminUsersView } from "@/components/admin/users";

export const metadata = {
  title: "User Accounts & Access | AEF Admin",
  description: "Manage registered user accounts, roles, and platform permissions.",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
