'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Search, RotateCcw } from 'lucide-react';
import { TrainingCentre } from '@/interfaces';

interface FacilitiesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  centreFilter: string;
  onCentreFilterChange: (value: string) => void;
  centres: TrainingCentre[];
  onReset?: () => void;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Room Types' },
  { value: 'Computer Lab', label: 'Computer Lab' },
  { value: 'Workshop / Practical Studio', label: 'Workshop / Studio' },
  { value: 'Lecture Hall', label: 'Lecture Hall' },
  { value: 'Seminar Room', label: 'Seminar Room' },
];

export function FacilitiesFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  centreFilter,
  onCentreFilterChange,
  centres,
  onReset,
}: FacilitiesFiltersProps) {
  const hasActiveFilters = Boolean(search || typeFilter || centreFilter);

  const handleReset = () => {
    onSearchChange('');
    onTypeFilterChange('');
    onCentreFilterChange('');
    onReset?.();
  };

  const selectedTypeLabel =
    TYPE_OPTIONS.find((t) => t.value === typeFilter)?.label ||
    'All Room Types';

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search facilities by name, room code, equipment..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Type Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={typeFilter || undefined}
            onValueChange={(val) =>
              onTypeFilterChange(val === 'all' || !val ? '' : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Room Types">
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

        {/* Centre Filter */}
        <div className="w-full sm:w-60">
          <Select
            value={centreFilter || undefined}
            onValueChange={(val) =>
              onCentreFilterChange(val === 'all' || !val ? '' : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Centres">
                {centreFilter || 'All Centres'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Centres</SelectItem>
              {centres.map((c) => (
                <SelectItem key={c._id} value={c.name}>
                  {c.name}
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
