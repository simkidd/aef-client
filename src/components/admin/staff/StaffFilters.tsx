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

interface StaffFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onReset?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories (All Staff)" },
  { value: "management", label: "Management" },
  { value: "trainers", label: "Trainers & Instructors" },
  { value: "administration", label: "Administration" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "HR" },
  { value: "drivers", label: "Drivers" },
  { value: "security", label: "Security" },
  { value: "cleaning", label: "Cleaning" },
];

export function StaffFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onReset,
}: StaffFiltersProps) {
  const hasActiveFilters = Boolean(search || categoryFilter);

  const handleReset = () => {
    onSearchChange("");
    onCategoryFilterChange("");
    onReset?.();
  };

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === categoryFilter)?.label ||
    "All Categories";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, staff code, position, email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-64">
          <Select
            value={categoryFilter || undefined}
            onValueChange={(val) =>
              onCategoryFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Categories">
                {selectedCategoryLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
