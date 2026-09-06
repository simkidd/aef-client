"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RotateCcw, Search } from "lucide-react";
import { TrainingCentre, Cohort } from "@/interfaces";

interface AttendanceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  centreFilter: string;
  onCentreFilterChange: (val: string) => void;
  cohortFilter: string;
  onCohortFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  centres?: TrainingCentre[];
  cohorts?: Cohort[];
  onReset: () => void;
}

const ATTENDANCE_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Present", label: "Present (On Time)" },
  { value: "Late", label: "Late (Grace Exceeded)" },
  { value: "Absent", label: "Absent" },
  { value: "Excused", label: "Excused (Official/Medical)" },
  { value: "Partial", label: "Partial" },
];

export function AttendanceFilters({
  search,
  onSearchChange,
  centreFilter,
  onCentreFilterChange,
  cohortFilter,
  onCohortFilterChange,
  statusFilter,
  onStatusFilterChange,
  centres = [],
  cohorts = [],
  onReset,
}: AttendanceFiltersProps) {
  const hasActiveFilters = Boolean(
    search || centreFilter || cohortFilter || statusFilter
  );

  const handleReset = () => {
    onSearchChange("");
    onCentreFilterChange("");
    onCohortFilterChange("");
    onStatusFilterChange("");
    onReset();
  };

  const selectedCentreLabel =
    centres.find((c) => (c._id || c.id) === centreFilter)?.name ||
    "All Centres";

  const selectedCohortLabel =
    cohorts.find((coh) => (coh._id || (coh as any).id) === cohortFilter)?.name ||
    "All Cohorts";

  const selectedStatusLabel =
    ATTENDANCE_STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ||
    "All Statuses";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs flex-wrap">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search trainee, code, track..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
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
                <SelectItem key={c._id || c.id} value={c._id || c.id || ""}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cohort Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={cohortFilter || undefined}
            onValueChange={(val) =>
              onCohortFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Cohorts">
                {selectedCohortLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cohorts</SelectItem>
              {cohorts.map((coh) => (
                <SelectItem key={coh._id} value={coh._id}>
                  {coh.name}
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
              <SelectValue placeholder="All Statuses">
                {selectedStatusLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ATTENDANCE_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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
