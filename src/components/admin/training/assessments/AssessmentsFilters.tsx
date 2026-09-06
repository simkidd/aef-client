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
import { Cohort } from "@/interfaces";

interface AssessmentsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  cohortFilter: string;
  onCohortFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  cohorts?: Cohort[];
  onReset: () => void;
}

const TYPE_OPTIONS = [
  { value: "all", label: "All Assessment Types" },
  { value: "Practical", label: "Practical Evaluation" },
  { value: "Theory", label: "Theory Exam" },
  { value: "Oral", label: "Oral Defense" },
  { value: "Project", label: "Capstone Project" },
];

export function AssessmentsFilters({
  search,
  onSearchChange,
  cohortFilter,
  onCohortFilterChange,
  typeFilter,
  onTypeFilterChange,
  cohorts = [],
  onReset,
}: AssessmentsFiltersProps) {
  const hasActiveFilters = Boolean(search || cohortFilter || typeFilter);

  const handleReset = () => {
    onSearchChange("");
    onCohortFilterChange("");
    onTypeFilterChange("");
    onReset();
  };

  const selectedCohortLabel =
    cohorts.find((coh) => (coh._id || (coh as any).id) === cohortFilter)?.name ||
    "All Cohorts";

  const selectedTypeLabel =
    TYPE_OPTIONS.find((t) => t.value === typeFilter)?.label ||
    "All Assessment Types";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs flex-wrap">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search title, criteria, examiner..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Cohort Filter */}
        <div className="w-full sm:w-56">
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

        {/* Type Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={typeFilter || undefined}
            onValueChange={(val) =>
              onTypeFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Types">
                {selectedTypeLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
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
