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

interface CertificatesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCentre: string;
  onCentreChange: (value: string) => void;
  selectedCohort: string;
  onCohortChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  centres: TrainingCentre[];
  cohorts: Cohort[];
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Issued", label: "Issued" },
  { value: "Pending", label: "Pending" },
  { value: "Revoked", label: "Revoked" },
];

export const CertificatesFilters: React.FC<CertificatesFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCentre,
  onCentreChange,
  selectedCohort,
  onCohortChange,
  selectedStatus,
  onStatusChange,
  centres,
  cohorts,
  onReset,
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
      (selectedCentre && selectedCentre !== "all") ||
      (selectedCohort && selectedCohort !== "all") ||
      (selectedStatus && selectedStatus !== "all")
  );

  const handleReset = () => {
    onSearchChange("");
    onCentreChange("all");
    onCohortChange("all");
    onStatusChange("all");
    onReset();
  };

  const selectedCentreLabel =
    centres.find((c) => (c._id || c.id) === selectedCentre)?.name ||
    "All Centres";

  const selectedCohortLabel =
    cohorts.find((c) => (c._id || (c as any).id) === selectedCohort)?.name ||
    "All Cohorts";

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label ||
    "All Status";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs flex-wrap">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search certificate #, student name, verification code..."
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

        {/* Status */}
        <div className="w-full sm:w-36">
          <Select
            value={selectedStatus || undefined}
            onValueChange={(val) => onStatusChange(val || "all")}
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Status">
                {selectedStatusLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
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
