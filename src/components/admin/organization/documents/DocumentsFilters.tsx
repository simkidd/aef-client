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

interface DocumentsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  catFilter: string;
  onCatFilterChange: (value: string) => void;
  accessFilter: string;
  onAccessFilterChange: (value: string) => void;
  onReset?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Document Categories' },
  { value: 'Policy & Governance', label: 'Policy & Governance' },
  { value: 'Training Curriculum', label: 'Training Curriculum' },
  { value: 'Legal & Compliance', label: 'Legal & Compliance' },
  { value: 'Forms & Templates', label: 'Forms & Templates' },
];

const ACCESS_OPTIONS = [
  { value: 'all', label: 'All Access Levels' },
  { value: 'Public', label: 'Public Access' },
  { value: 'Staff Only', label: 'Staff Only' },
  { value: 'Executive / Admin', label: 'Executive / Admin' },
];

export function DocumentsFilters({
  search,
  onSearchChange,
  catFilter,
  onCatFilterChange,
  accessFilter,
  onAccessFilterChange,
  onReset,
}: DocumentsFiltersProps) {
  const hasActiveFilters = Boolean(search || catFilter || accessFilter);

  const handleReset = () => {
    onSearchChange('');
    onCatFilterChange('');
    onAccessFilterChange('');
    onReset?.();
  };

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === catFilter)?.label ||
    'All Categories';

  const selectedAccessLabel =
    ACCESS_OPTIONS.find((a) => a.value === accessFilter)?.label ||
    'All Access Levels';

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-xl">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search repository by document title, keywords..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs h-9 min-h-9"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={catFilter || undefined}
            onValueChange={(val) =>
              onCatFilterChange(val === 'all' || !val ? '' : val)
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

        {/* Access Level Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={accessFilter || undefined}
            onValueChange={(val) =>
              onAccessFilterChange(val === 'all' || !val ? '' : val)
            }
          >
            <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
              <SelectValue placeholder="All Access Levels">
                {selectedAccessLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ACCESS_OPTIONS.map((opt) => (
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
