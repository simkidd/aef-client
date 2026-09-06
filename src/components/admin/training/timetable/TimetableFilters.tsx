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
import { TrainingCentre, Cohort } from "@/interfaces";

interface TimetableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  centreFilter: string;
  onCentreFilterChange: (value: string) => void;
  cohortFilter: string;
  onCohortFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  centres?: TrainingCentre[];
  cohorts?: Cohort[];
  onReset: () => void;
}

export function TimetableFilters({
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
}: TimetableFiltersProps) {
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

  const selectedStatusLabel = statusFilter || "All Status";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs flex-wrap">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search room, instructor, skill topic..."
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
        <div className="w-full sm:w-36">
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
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
