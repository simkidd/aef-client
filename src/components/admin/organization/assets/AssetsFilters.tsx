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

interface AssetsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  conditionFilter: string;
  onConditionFilterChange: (value: string) => void;
  centreFilter: string;
  onCentreFilterChange: (value: string) => void;
  centres: TrainingCentre[];
  onReset?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'IT Equipment', label: 'IT Equipment' },
  { value: 'Solar Workshop Gear', label: 'Solar Workshop Gear' },
  { value: 'Esthetics Tools', label: 'Esthetics Tools' },
  { value: 'Biometric Hardware', label: 'Biometric Hardware' },
];

const CONDITION_OPTIONS = [
  { value: 'all', label: 'All Conditions' },
  { value: 'Excellent', label: 'Excellent Condition' },
  { value: 'Good', label: 'Good Condition' },
  { value: 'Needs Repair', label: 'Needs Repair' },
  { value: 'Retired', label: 'Retired / Decommissioned' },
];

export function AssetsFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  conditionFilter,
  onConditionFilterChange,
  centreFilter,
  onCentreFilterChange,
  centres,
  onReset,
}: AssetsFiltersProps) {
  const hasActiveFilters = Boolean(
    search || categoryFilter || conditionFilter || centreFilter
  );

  const handleReset = () => {
    onSearchChange('');
    onCategoryFilterChange('');
    onConditionFilterChange('');
    onCentreFilterChange('');
    onReset?.();
  };

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === categoryFilter)?.label ||
    'All Categories';

  const selectedConditionLabel =
    CONDITION_OPTIONS.find((c) => c.value === conditionFilter)?.label ||
    'All Conditions';

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search assets by tag, name, serial number, room..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-52">
          <Select
            value={categoryFilter || undefined}
            onValueChange={(val) =>
              onCategoryFilterChange(val === 'all' || !val ? '' : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Categories">
                {selectedCategoryLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={conditionFilter || undefined}
            onValueChange={(val) =>
              onConditionFilterChange(val === 'all' || !val ? '' : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Conditions">
                {selectedConditionLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Centre Filter */}
        <div className="w-full sm:w-52">
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
