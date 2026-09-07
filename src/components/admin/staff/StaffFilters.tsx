"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

interface StaffFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onReset?: () => void;
}

export function StaffFilters({
  search,
  onSearchChange,
  onReset,
}: StaffFiltersProps) {
  const hasActiveFilters = Boolean(search);

  const handleReset = () => {
    onSearchChange("");
    onReset?.();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, job title, staff code, email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Reset Filter Button */}
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
