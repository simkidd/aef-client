"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

interface AuditFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  entityFilter: string;
  onEntityFilterChange: (value: string) => void;
  onReset?: () => void;
  actionOptions?: string[];
  entityOptions?: string[];
}

export function AuditFilters({
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  entityFilter,
  onEntityFilterChange,
  onReset,
  actionOptions = [],
  entityOptions = [],
}: AuditFiltersProps) {
  const hasActiveFilters = Boolean(
    search || (actionFilter && actionFilter !== "all") || (entityFilter && entityFilter !== "all")
  );

  const handleReset = () => {
    onSearchChange("");
    onActionFilterChange("");
    onEntityFilterChange("");
    onReset?.();
  };

  const selectedActionLabel =
    actionFilter && actionFilter !== "all" ? actionFilter : "All Audit Actions";

  const selectedEntityLabel =
    entityFilter && entityFilter !== "all" ? entityFilter : "All Entity Types";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by actor, email, entity ID, or reason..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Action Type Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={actionFilter || undefined}
            onValueChange={(val) =>
              onActionFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Audit Actions">
                {selectedActionLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">⚡ All Audit Actions</SelectItem>
              {actionOptions.map((act) => (
                <SelectItem key={act} value={act}>
                  {act}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entity Type Filter */}
        <div className="w-full sm:w-52">
          <Select
            value={entityFilter || undefined}
            onValueChange={(val) =>
              onEntityFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Entity Types">
                {selectedEntityLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">📦 All Entity Types</SelectItem>
              {entityOptions.map((ent) => (
                <SelectItem key={ent} value={ent}>
                  {ent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="default"
            onClick={handleReset}
            className="h-9 min-h-9 data-[size=default]:h-9 text-xs gap-1.5 px-3 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
