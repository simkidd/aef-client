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
import { Program, TrainingCentre } from "@/interfaces";

interface CohortsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  centreFilter: string;
  onCentreFilterChange: (value: string) => void;
  programFilter: string;
  onProgramFilterChange: (value: string) => void;
  centres: TrainingCentre[];
  programs: Program[];
  onReset?: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "enrolling", label: "Enrolling" },
  { value: "in_progress", label: "In Progress" },
  { value: "assessments", label: "Assessments" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function CohortsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  centreFilter,
  onCentreFilterChange,
  programFilter,
  onProgramFilterChange,
  centres,
  programs,
  onReset,
}: CohortsFiltersProps) {
  const hasActiveFilters = Boolean(
    search || statusFilter || centreFilter || programFilter
  );

  const handleReset = () => {
    onSearchChange("");
    onStatusFilterChange("");
    onCentreFilterChange("");
    onProgramFilterChange("");
    onReset?.();
  };

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label || "All Status";

  const selectedCentreLabel =
    centres.find((c) => c._id === centreFilter)?.name || "All Centres";

  const selectedProgramLabel =
    programs.find((p) => p._id === programFilter)?.title || "All Programs";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search cohorts by name, code, or centre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
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

        {/* Centre Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={centreFilter || undefined}
            onValueChange={(val) =>
              onCentreFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Centres">
                {selectedCentreLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Centres</SelectItem>
              {centres.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Program Filter */}
        <div className="w-full sm:w-52">
          <Select
            value={programFilter || undefined}
            onValueChange={(val) =>
              onProgramFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Programs">
                {selectedProgramLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.title}
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
