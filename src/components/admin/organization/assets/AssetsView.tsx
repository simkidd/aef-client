'use client';

import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Laptop,
  Sun,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCentresQuery, useAssetsQuery } from '@/hooks/queries/useCentreQueries';
import { useCreateAssetMutation } from '@/hooks/mutations/useCentreMutations';
import { AddAssetModal } from './AddAssetModal';
import { AssetsFilters } from './AssetsFilters';
import { AssetsTable } from './AssetsTable';
import { AssetRecord } from './AssetDetailsSheet';

const ITEMS_PER_PAGE = 10;

export function AssetsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [centreFilter, setCentreFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: centres = [] } = useCentresQuery();
  const { data: backendAssets = [], isLoading, refetch, isFetching } = useAssetsQuery();
  const createAssetMutation = useCreateAssetMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
    },
  });

  // Map backend assets to UI structure
  const assets: AssetRecord[] = useMemo(() => {
    return backendAssets.map((a: any) => ({
      id: a._id,
      tag: a.assetTag || `AEF-AST-${a._id?.slice(-4)}`,
      name: a.name || 'Hardware Asset',
      category: a.category ? (a.category.charAt(0).toUpperCase() + a.category.slice(1)) : 'IT Equipment',
      serialNumber: a.serialNumber || 'SN-PENDING-001',
      centreName: a.centreId?.name || (typeof a.centreId === 'string' ? a.centreId : 'Central Hub'),
      roomName: a.roomId?.name || (typeof a.roomId === 'string' ? a.roomId : 'Lab / Workshop'),
      purchaseDate: a.purchaseDate ? new Date(a.purchaseDate).toISOString().split('T')[0] : '2026-01-01',
      condition: (a.condition ? a.condition.charAt(0).toUpperCase() + a.condition.slice(1) : 'Good') as any,
      assignedTo: a.assignedStaffId ? `${a.assignedStaffId.firstName} ${a.assignedStaffId.lastName}` : undefined,
    }));
  }, [backendAssets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.serialNumber.toLowerCase().includes(q) ||
        a.centreName.toLowerCase().includes(q) ||
        a.roomName.toLowerCase().includes(q);

      const matchesCat = !categoryFilter || a.category.toLowerCase().includes(categoryFilter.toLowerCase());
      const matchesCond = !conditionFilter || a.condition.toLowerCase() === conditionFilter.toLowerCase();
      const matchesCentre = !centreFilter || a.centreName === centreFilter;

      return matchesSearch && matchesCat && matchesCond && matchesCentre;
    });
  }, [assets, search, categoryFilter, conditionFilter, centreFilter]);

  const total = filteredAssets.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAssets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssets, page]);

  const handleAddAsset = (data: {
    tag: string;
    name: string;
    category: AssetRecord['category'];
    serialNumber: string;
    centreName: string;
    roomName: string;
    condition: AssetRecord['condition'];
    assignedTo?: string;
  }) => {
    const selectedCentre = centres.find((c) => c.name === data.centreName);

    createAssetMutation.mutate({
      assetTag: data.tag.trim().toUpperCase(),
      name: data.name.trim(),
      category: data.category.toLowerCase(),
      serialNumber: data.serialNumber.trim(),
      centreId: selectedCentre?._id || centres[0]?._id,
      condition: data.condition.toLowerCase(),
      status: 'in use',
      purchaseDate: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Physical Assets & Workshop Inventory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track foundation hardware, solar equipment, laboratory computers, and biometric terminals across all centres.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs h-9 font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Log New Asset
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Logged Assets
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : assets.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Operational Condition
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : assets.filter((a) => a.condition === 'Excellent' || a.condition === 'Good').length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              IT & Computing
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : assets.filter((a) => a.category.toLowerCase().includes('it') || a.category.toLowerCase().includes('precision')).length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Solar Workshop Gear
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : assets.filter((a) => a.category.toLowerCase().includes('solar')).length}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <AssetsFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(val) => {
          setCategoryFilter(val);
          setPage(1);
        }}
        conditionFilter={conditionFilter}
        onConditionFilterChange={(val) => {
          setConditionFilter(val);
          setPage(1);
        }}
        centreFilter={centreFilter}
        onCentreFilterChange={(val) => {
          setCentreFilter(val);
          setPage(1);
        }}
        centres={centres}
        onReset={() => setPage(1)}
      />

      {/* Asset Table */}
      <AssetsTable
        assets={paginatedAssets}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        centres={centres}
        suggestedTag={`AEF-AST-${(assets.length + 101).toString().padStart(4, '0')}`}
        onAddAsset={handleAddAsset}
      />
    </div>
  );
}
