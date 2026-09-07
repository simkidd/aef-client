"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Users, Key, ChevronRight, Lock } from "lucide-react";

interface RoleItem {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  defaultScope?: string;
  permissions?: string[];
  isSystem?: boolean;
}

interface RoleSelectorListProps {
  roles: RoleItem[];
  selectedRoleId?: string;
  onSelectRole: (role: RoleItem) => void;
  isLoading?: boolean;
}

export function RoleSelectorList({
  roles = [],
  selectedRoleId,
  onSelectRole,
  isLoading,
}: RoleSelectorListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Configured System Roles ({roles.length})
        </h3>
      </div>

      <div className="space-y-2">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role._id;
          return (
            <button
              key={role._id}
              type="button"
              onClick={() => onSelectRole(role)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs relative group ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-xs font-medium"
                  : "border-border bg-card text-foreground hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-foreground block truncate">
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span title="System Core Role">
                        <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mt-0.5">
                    Scope: {role.defaultScope || "CENTRE"}
                  </span>
                </div>

                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isSelected
                      ? "text-primary translate-x-0.5"
                      : "text-muted-foreground/40 group-hover:text-muted-foreground"
                  }`}
                />
              </div>

              {role.description && (
                <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {role.description}
                </p>
              )}

              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Granted Capabilities:</span>
                <span className="font-mono font-bold text-primary px-1.5 py-0.2 rounded bg-primary/15">
                  {role.permissions?.length || 0} permissions
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
