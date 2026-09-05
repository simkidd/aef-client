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

interface TraineesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  trackFilter: string;
  onTrackFilterChange: (value: string) => void;
  onReset?: () => void;
}

const TRACK_OPTIONS = [
  { value: "all", label: "All Skill Tracks" },
  { value: "Solar Photovoltaic Installation", label: "Solar Photovoltaic Installation" },
  { value: "Electric Vehicle Maintenance", label: "Electric Vehicle Maintenance" },
  { value: "Full Stack Web Development", label: "Full Stack Web Development" },
  { value: "Fashion Design & Garment Making", label: "Fashion Design & Garment Making" },
  { value: "Digital Agriculture & Hydroponics", label: "Digital Agriculture & Hydroponics" },
  { value: "Culinary Arts & Pastry", label: "Culinary Arts & Pastry" },
  { value: "Cosmetology & Aesthetics", label: "Cosmetology & Aesthetics" },
  { value: "Welding & Metal Fabrication", label: "Welding & Metal Fabrication" },
];

export function TraineesFilters({
  search,
  onSearchChange,
  trackFilter,
  onTrackFilterChange,
  onReset,
}: TraineesFiltersProps) {
  const hasActiveFilters = Boolean(search || trackFilter);

  const handleReset = () => {
    onSearchChange("");
    onTrackFilterChange("");
    onReset?.();
  };

  const selectedTrackLabel =
    TRACK_OPTIONS.find((t) => t.value === trackFilter)?.label ||
    "All Skill Tracks";

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by trainee name, enrollment code, phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Track Filter */}
        <div className="w-full sm:w-72">
          <Select
            value={trackFilter || undefined}
            onValueChange={(val) =>
              onTrackFilterChange(val === "all" || !val ? "" : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Skill Tracks">
                {selectedTrackLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TRACK_OPTIONS.map((opt) => (
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
