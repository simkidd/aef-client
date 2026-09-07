"use client";

import React, { useState, useEffect } from "react";
import { useRolesMatrixQuery } from "@/hooks/queries/useAdminQueries";
import { useUpdateRolePermissionsMutation } from "@/hooks/mutations/useAdminMutations";
import { RoleSelectorList } from "./RoleSelectorList";
import { PermissionsMatrixGrid } from "./PermissionsMatrixGrid";
import { ShieldCheck, RefreshCw, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RolesPermissionsMatrixView() {
  const { data: rolesData, isLoading, refetch, isFetching } = useRolesMatrixQuery();
  const updateRoleMutation = useUpdateRolePermissionsMutation();

  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [activePerms, setActivePerms] = useState<string[]>([]);
  const [mobileScreen, setMobileScreen] = useState<"roles" | "matrix">("roles");

  // Automatically select first role once loaded
  useEffect(() => {
    if (rolesData?.roles && rolesData.roles.length > 0 && !selectedRole) {
      setSelectedRole(rolesData.roles[0]);
      setActivePerms(rolesData.roles[0].permissions || []);
    }
  }, [rolesData, selectedRole]);

  const handleSelectRole = (role: any) => {
    setSelectedRole(role);
    setActivePerms(role.permissions || []);
    setMobileScreen("matrix");
  };

  const handleBackToRoles = () => {
    setMobileScreen("roles");
  };

  const handleTogglePerm = (code: string) => {
    if (activePerms.includes(code)) {
      setActivePerms(activePerms.filter((p) => p !== code));
    } else {
      setActivePerms([...activePerms, code]);
    }
  };

  const handleSelectAllCategory = (codes: string[], select: boolean) => {
    if (select) {
      const merged = Array.from(new Set([...activePerms, ...codes]));
      setActivePerms(merged);
    } else {
      setActivePerms(activePerms.filter((c) => !codes.includes(c)));
    }
  };

  const handleSave = () => {
    if (!selectedRole) return;
    updateRoleMutation.mutate({
      id: selectedRole._id,
      permissions: activePerms,
    });
  };

  // Determine if permissions were altered compared to original
  const hasChanges = Boolean(
    selectedRole &&
      (activePerms.length !== (selectedRole.permissions?.length || 0) ||
        activePerms.some((p) => !selectedRole.permissions?.includes(p)))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Roles & Granular RBAC Permissions
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Define system authorization tiers and fine-grained action boundaries.
            Backend enforces both action privileges and physical centre scope
            limits.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh Roles
          </Button>
        </div>
      </div>

      {/* Main 2-Column Split on Desktop, Screen-by-Screen on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Role Selector (hidden on mobile when viewing matrix) */}
        <div
          className={`lg:col-span-1 ${
            mobileScreen === "matrix" ? "hidden lg:block" : "block"
          }`}
        >
          <RoleSelectorList
            roles={rolesData?.roles || []}
            selectedRoleId={selectedRole?._id}
            onSelectRole={handleSelectRole}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Interactive Permissions Matrix (hidden on mobile when viewing roles list) */}
        <div
          className={`lg:col-span-2 ${
            mobileScreen === "roles" ? "hidden lg:block" : "block"
          }`}
        >
          <PermissionsMatrixGrid
            selectedRole={selectedRole}
            allPermissions={rolesData?.allPermissions || []}
            activePerms={activePerms}
            onTogglePerm={handleTogglePerm}
            onSelectAllCategory={handleSelectAllCategory}
            onSave={handleSave}
            onBack={handleBackToRoles}
            isSaving={updateRoleMutation.isPending}
            hasChanges={hasChanges}
          />
        </div>
      </div>
    </div>
  );
}
