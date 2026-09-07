"use client";

import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, CheckSquare, Square, Save, Loader2, Key } from "lucide-react";

interface PermissionItem {
  code: string;
  name: string;
  description?: string;
  category?: string;
}

interface PermissionsMatrixGridProps {
  selectedRole: any;
  allPermissions: PermissionItem[];
  activePerms: string[];
  onTogglePerm: (code: string) => void;
  onSelectAllCategory: (codes: string[], select: boolean) => void;
  onSave: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function PermissionsMatrixGrid({
  selectedRole,
  allPermissions = [],
  activePerms = [],
  onTogglePerm,
  onSelectAllCategory,
  onSave,
  isSaving,
  hasChanges,
}: PermissionsMatrixGridProps) {
  const [search, setSearch] = useState("");

  // Group permissions by category/prefix (e.g. attendance, biometrics, programs, etc.)
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionItem[]> = {};

    allPermissions.forEach((perm) => {
      // Filter search
      if (search) {
        const q = search.toLowerCase();
        if (
          !perm.name.toLowerCase().includes(q) &&
          !perm.code.toLowerCase().includes(q) &&
          !(perm.description || "").toLowerCase().includes(q)
        ) {
          return;
        }
      }

      // Infer category from category field or code prefix (e.g., "attendance:view" -> "Attendance")
      let category = perm.category;
      if (!category) {
        const prefix = perm.code.split(":")[0];
        category = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }

      if (!groups[category]) groups[category] = [];
      groups[category].push(perm);
    });

    return groups;
  }, [allPermissions, search]);

  if (!selectedRole) {
    return (
      <Card className="border-border bg-card shadow-2xs h-full flex items-center justify-center p-12 text-center">
        <div className="space-y-2 max-w-sm">
          <Key className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-foreground text-sm font-heading">
            Select a System Role
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose a role from the left panel to inspect and customize its granular
            RBAC permission privileges.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-2xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <CardHeader className="p-4 sm:p-5 border-b border-border bg-muted/20 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold font-heading text-foreground">
                Permissions for: {selectedRole.name}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Configuring scope: <strong className="text-foreground">{selectedRole.defaultScope || "CENTRE"}</strong> • {activePerms.length} permissions currently assigned.
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className="text-xs h-8 font-semibold gap-1.5 shadow-2xs shrink-0"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Matrix...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Permissions</span>
              </>
            )}
          </Button>
        </div>

        {/* Search inside permissions */}
        <div className="pt-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search permission by name or code (e.g. attendance:edit)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>
      </CardHeader>

      {/* Permissions Groups Content */}
      <CardContent className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6 max-h-[60vh]">
        {Object.keys(groupedPermissions).length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No permissions matching "{search}".
          </div>
        ) : (
          Object.entries(groupedPermissions).map(([category, perms]) => {
            const categoryCodes = perms.map((p) => p.code);
            const allChecked = categoryCodes.every((c) => activePerms.includes(c));
            const someChecked = categoryCodes.some((c) => activePerms.includes(c));

            return (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <span>{category} Domain</span>
                    <span className="text-[10px] font-mono text-muted-foreground font-normal">
                      ({perms.length})
                    </span>
                  </h4>

                  <button
                    type="button"
                    onClick={() => onSelectAllCategory(categoryCodes, !allChecked)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    {allChecked ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {perms.map((perm) => {
                    const isChecked = activePerms.includes(perm.code);
                    return (
                      <label
                        key={perm.code}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                          isChecked
                            ? "border-primary/30 bg-primary/5 text-foreground shadow-2xs font-medium"
                            : "border-border bg-card text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onTogglePerm(perm.code)}
                          className="h-4 w-4 rounded text-primary mt-0.5 accent-primary cursor-pointer"
                        />
                        <div className="min-w-0">
                          <strong className="text-foreground block truncate">
                            {perm.name}
                          </strong>
                          <span className="font-mono text-[10px] text-muted-foreground block truncate mt-0.5">
                            {perm.code}
                          </span>
                          {perm.description && (
                            <p className="text-[10px] text-muted-foreground/80 mt-1 line-clamp-2">
                              {perm.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
