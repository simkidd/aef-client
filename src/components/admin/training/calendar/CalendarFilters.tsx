"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import { TrainingCentre, Cohort } from "@/interfaces";

interface CalendarFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCentre: string;
  onCentreChange: (value: string) => void;
  selectedCohort: string;
  onCohortChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  centres: TrainingCentre[];
  cohorts: Cohort[];
  onReset: () => void;
}

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "Lecture", label: "Lecture" },
  { value: "Practical", label: "Practical Lab" },
  { value: "Assessment", label: "Assessment" },
  { value: "Workshop", label: "Workshop" },
];

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCentre,
  onCentreChange,
  selectedCohort,
  onCohortChange,
  selectedType,
  onTypeChange,
  centres,
  cohorts,
  onReset,
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
      (selectedCentre && selectedCentre !== "all") ||
      (selectedCohort && selectedCohort !== "all") ||
      (selectedType && selectedType !== "all")
  );

  const handleReset = () => {
    onSearchChange("");
    onCentreChange("all");
    onCohortChange("all");
    onTypeChange("all");
    onReset();
  };

  const selectedCentreLabel =
    centres.find((c) => (c._id || c.id) === selectedCentre)?.name ||
    "All Centres";

  const selectedCohortLabel =
    cohorts.find((c) => (c._id || (c as any).id) === selectedCohort)?.name ||
    "All Cohorts";

  const selectedTypeLabel =
    TYPE_OPTIONS.find((t) => t.value === selectedType)?.label || "All Types";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs flex-wrap">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search session topic, trainer, room..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Centre Select */}
        <div className="w-full sm:w-48">
          <Select
            value={selectedCentre || undefined}
            onValueChange={(val) => onCentreChange(val || "all")}
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

        {/* Cohort Select */}
        <div className="w-full sm:w-48">
          <Select
            value={selectedCohort || undefined}
            onValueChange={(val) => onCohortChange(val || "all")}
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Cohorts">
                {selectedCohortLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cohorts</SelectItem>
              {cohorts.map((c) => (
                <SelectItem key={c._id || (c as any).id} value={c._id || (c as any).id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Type */}
        <div className="w-full sm:w-40">
          <Select
            value={selectedType || undefined}
            onValueChange={(val) => onTypeChange(val || "all")}
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Types">
                {selectedTypeLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
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
};
