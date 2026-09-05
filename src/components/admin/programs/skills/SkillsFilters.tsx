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

interface SkillsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Renewable Energy", label: "Renewable Energy" },
  { value: "Technical / Vocational", label: "Technical / Vocational" },
  { value: "Digital & ICT", label: "Digital & ICT" },
  { value: "Creative Arts", label: "Creative Arts" },
  { value: "Business & Entrepreneurship", label: "Business & Entrepreneurship" },
  { value: "Agriculture", label: "Agriculture & Agro-Tech" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function SkillsFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}: SkillsFiltersProps) {
  const hasActiveFilters = Boolean(search || categoryFilter || statusFilter);

  const handleReset = () => {
    onSearchChange("");
    onCategoryFilterChange("");
    onStatusFilterChange("");
    onReset?.();
  };

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === categoryFilter)?.label ||
    "All Categories";

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label || "All Status";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search skill areas by name, code, or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-56">
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
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44">
          <Select
            value={statusFilter || undefined}
            onValueChange={(val) =>
              onStatusFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Status">
                {selectedStatusLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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
