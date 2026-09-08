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

interface ProgramsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  organizerTypeFilter: string;
  onOrganizerTypeFilterChange: (value: string) => void;
  onReset?: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "enrolling", label: "Enrolling" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const ORGANIZER_OPTIONS = [
  { value: "all", label: "All Organizers" },
  { value: "Adele Owned", label: "Adele Owned" },
  { value: "Government Owned", label: "Government Owned" },
  { value: "NGO Partner", label: "NGO Partner" },
  { value: "Private Sector", label: "Private Sector" },
  { value: "Joint Venture", label: "Joint Venture" },
];

export function ProgramsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  organizerTypeFilter,
  onOrganizerTypeFilterChange,
  onReset,
}: ProgramsFiltersProps) {
  const hasActiveFilters = Boolean(
    search || statusFilter || organizerTypeFilter,
  );

  const handleReset = () => {
    onSearchChange("");
    onStatusFilterChange("");
    onOrganizerTypeFilterChange("");
    onReset?.();
  };

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ||
    "All Statuses";

  const selectedOrganizerLabel =
    ORGANIZER_OPTIONS.find((o) => o.value === organizerTypeFilter)?.label ||
    "All Organizers";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search programs by title, code, organizer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter || undefined}
            onValueChange={(val) =>
              onStatusFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Statuses">
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

        {/* Organizer Filter */}
        <div className="w-full sm:w-52">
          <Select
            value={organizerTypeFilter || undefined}
            onValueChange={(val) =>
              onOrganizerTypeFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Organizers">
                {selectedOrganizerLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ORGANIZER_OPTIONS.map((opt) => (
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
