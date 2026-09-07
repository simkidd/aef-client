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

interface PartnersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset?: () => void;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Partner Types' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Government', label: 'Government Agency' },
  { value: 'Sponsor', label: 'Sponsor / Grantor' },
  { value: 'NGO', label: 'NGO / Foundation' },
  { value: 'Training Organization', label: 'Training Organization' },
  { value: 'Funding Agency', label: 'Funding Agency' },
  { value: 'Employer', label: 'Employer / Hiring' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'prospective', label: 'Prospective' },
  { value: 'inactive', label: 'Inactive' },
];

export function PartnersFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}: PartnersFiltersProps) {
  const hasActiveFilters = Boolean(search || typeFilter || statusFilter);

  const handleReset = () => {
    onSearchChange('');
    onTypeFilterChange('');
    onStatusFilterChange('');
    onReset?.();
  };

  const selectedTypeLabel =
    TYPE_OPTIONS.find((t) => t.value === typeFilter)?.label ||
    'All Partner Types';

  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ||
    'All Status';

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search partners by name, code, contact person..."
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
              <SelectValue placeholder="All Partner Types">
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

        {/* Status Filter */}
        <div className="w-full sm:w-44">
          <Select
            value={statusFilter || undefined}
            onValueChange={(val) =>
              onStatusFilterChange(val === 'all' || !val ? '' : val)
            }
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
