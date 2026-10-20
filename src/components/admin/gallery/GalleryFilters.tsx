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
import { GALLERY_CATEGORIES } from "./PhotoFormModal";

interface GalleryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  featuredFilter: string;
  onFeaturedFilterChange: (value: string) => void;
  onReset?: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Visibility" },
  { value: "active", label: "Published (Visible)" },
  { value: "inactive", label: "Hidden (Draft)" },
];

const FEATURED_OPTIONS = [
  { value: "all", label: "All Highlights" },
  { value: "featured", label: "Featured on Homepage" },
  { value: "standard", label: "Standard Catalog" },
];

export function GalleryFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
  onReset,
}: GalleryFiltersProps) {
  const hasActiveFilters = Boolean(
    search ||
      (categoryFilter && categoryFilter !== "All") ||
      (statusFilter && statusFilter !== "all") ||
      (featuredFilter && featuredFilter !== "all"),
  );

  const handleReset = () => {
    onSearchChange("");
    onCategoryFilterChange("All");
    onStatusFilterChange("all");
    onFeaturedFilterChange("all");
    onReset?.();
  };

  const selectedCategoryLabel =
    categoryFilter && categoryFilter !== "All"
      ? categoryFilter
      : "All Categories";

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ||
    "All Visibility";

  const selectedFeaturedLabel =
    FEATURED_OPTIONS.find((f) => f.value === featuredFilter)?.label ||
    "All Highlights";

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by photo title, location, or track..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-52">
          <Select
            value={categoryFilter || "All"}
            onValueChange={(val) => onCategoryFilterChange(val || "All")}
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Categories">
                {selectedCategoryLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {GALLERY_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <Select
            value={statusFilter || "all"}
            onValueChange={(val) => onStatusFilterChange(val || "all")}
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Visibility">
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

        {/* Featured Filter */}
        <div className="w-full md:w-48">
          <Select
            value={featuredFilter || "all"}
            onValueChange={(val) => onFeaturedFilterChange(val || "all")}
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Highlights">
                {selectedFeaturedLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {FEATURED_OPTIONS.map((opt) => (
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
