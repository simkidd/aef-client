"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Lock, CheckCircle2, UserCheck, Key } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { api } from "@/lib/client";

export default function RolesPermissionsMatrixPage() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [activePerms, setActivePerms] = useState<string[]>([]);

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["admin-roles-matrix"],
    queryFn: async () => {
      const res = await api.get("/admin/roles");
      return res.data?.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      id,
      permissions,
    }: {
      id: string;
      permissions: string[];
    }) => {
      const res = await api.put(`/admin/roles/${id}`, { permissions });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles-matrix"] });
    },
  });

  const handleSelectRole = (role: any) => {
    setSelectedRole(role);
    setActivePerms(role.permissions || []);
  };

  const handleTogglePerm = (permCode: string) => {
    if (activePerms.includes(permCode)) {
      setActivePerms(activePerms.filter((p) => p !== permCode));
    } else {
      setActivePerms([...activePerms, permCode]);
    }
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;
    updateRoleMutation.mutate({
      id: selectedRole._id,
      permissions: activePerms,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Roles & Granular RBAC Permissions Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system roles and fine-grained action permissions (e.g.
            attendance editing, biometric registration, sensitive HR viewing).
            Backend strictly enforces action and scope boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <Card className="p-4 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Configured System Roles
            </h2>
            {rolesData?.roles?.map((role: any) => (
              <button
                key={role._id}
                type="button"
                onClick={() => handleSelectRole(role)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                  selectedRole?._id === role._id
                    ? "border-primary/20 bg-primary/10 text-primary font-bold dark:bg-primary/15 dark:text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{role.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {role.defaultScope}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-normal line-clamp-2">
                  {role.description}
                </p>
                <p className="text-[10px] text-primary font-semibold mt-2">
                  {role.permissions?.length || 0} permissions assigned
                </p>
              </button>
            ))}
          </Card>

          {/* Permissions Matrix Checklist */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {selectedRole
                      ? `Permissions for: ${selectedRole.name}`
                      : "Select a role to configure"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Toggle individual permission codes assigned to this role.
                  </CardDescription>
                </div>
                {selectedRole && (
                  <Button
                    onClick={handleSaveRole}
                    disabled={updateRoleMutation.isPending}
                    className="text-xs font-semibold"
                  >
                    {updateRoleMutation.isPending
                      ? "Saving..."
                      : "Save Permissions"}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 max-h-[65vh] overflow-y-auto">
              {selectedRole ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {rolesData?.allPermissions?.map((perm: any) => {
                    const isChecked = activePerms.includes(perm.code);
                    return (
                      <label
                        key={perm.code}
                        className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? "border-primary/20 bg-primary/10 text-primary dark:bg-primary/15 dark:border-primary/20 dark:text-primary"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePerm(perm.code)}
                          className="h-4 w-4 rounded text-primary mt-0.5"
                        />
                        <div>
                          <span className="font-bold block">{perm.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {perm.code}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Select a role from the left to view and modify permissions.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
