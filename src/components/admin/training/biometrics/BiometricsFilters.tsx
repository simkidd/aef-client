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
import { TrainingCentre } from "@/interfaces";

interface BiometricsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCentre: string;
  onCentreChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  centres: TrainingCentre[];
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Online", label: "Online (Active)" },
  { value: "Offline", label: "Offline" },
  { value: "Syncing", label: "Syncing" },
  { value: "Maintenance", label: "Maintenance" },
];

export function BiometricsFilters({
  searchQuery,
  onSearchChange,
  selectedCentre,
  onCentreChange,
  selectedStatus,
  onStatusChange,
  centres,
  onReset,
}: BiometricsFiltersProps) {
  const hasActiveFilters = Boolean(
    searchQuery ||
      (selectedCentre && selectedCentre !== "all") ||
      (selectedStatus && selectedStatus !== "all")
  );

  const handleReset = () => {
    onSearchChange("");
    onCentreChange("all");
    onStatusChange("all");
    onReset();
  };

  const selectedCentreLabel =
    centres.find((c) => (c._id || c.id) === selectedCentre)?.name ||
    "All Centres";

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
            placeholder="Search device name, serial number, gate location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Centre Select */}
        <div className="w-full sm:w-56">
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

        {/* Status Select */}
        <div className="w-full sm:w-44">
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
              {STATUS_OPTIONS.map((opt) => (
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
