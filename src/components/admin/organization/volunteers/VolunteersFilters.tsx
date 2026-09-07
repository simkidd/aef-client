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

interface VolunteersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  centreFilter: string;
  onCentreFilterChange: (value: string) => void;
  centres: TrainingCentre[];
  onReset?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Active', label: 'Active in Field' },
  { value: 'Onboarding', label: 'Onboarding / Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

export function VolunteersFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  centreFilter,
  onCentreFilterChange,
  centres,
  onReset,
}: VolunteersFiltersProps) {
  const hasActiveFilters = Boolean(search || statusFilter || centreFilter);

  const handleReset = () => {
    onSearchChange('');
    onStatusFilterChange('');
    onCentreFilterChange('');
    onReset?.();
  };

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ||
    'All Statuses';

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search volunteers by name, email, skills, role..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={statusFilter || undefined}
            onValueChange={(val) =>
              onStatusFilterChange(val === 'all' || !val ? '' : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Statuses">
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
