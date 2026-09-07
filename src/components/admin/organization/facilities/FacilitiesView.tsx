'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Users,
  Sun,
  Laptop,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCentresQuery, useRoomsQuery } from '@/hooks/queries/useCentreQueries';
import { useCreateRoomMutation } from '@/hooks/mutations/useCentreMutations';
import { AddFacilityModal } from './AddFacilityModal';
import { FacilitiesFilters } from './FacilitiesFilters';
import { FacilitiesTable } from './FacilitiesTable';
import { RoomFacility } from './FacilityDetailsSheet';

const ITEMS_PER_PAGE = 10;

export function FacilitiesView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [centreFilter, setCentreFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: centres = [] } = useCentresQuery();
  const { data: backendRooms = [], isLoading, refetch, isFetching } = useRoomsQuery();
  const createRoomMutation = useCreateRoomMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
    },
  });

  // Map backend rooms to UI structure
  const rooms: RoomFacility[] = useMemo(() => {
    return backendRooms.map((r: any) => ({
      id: r._id,
      name: r.name || 'Training Facility',
      code: r.roomNumber || `ROOM-${r._id?.slice(-4)}`,
      centreName: r.centreId?.name || (typeof r.centreId === 'string' ? r.centreId : 'Central Hub'),
      type: r.type ? (r.type.charAt(0).toUpperCase() + r.type.slice(1)) : 'Workshop',
      capacity: r.capacity || 30,
      features: r.equipment || ['Standard Laboratory Workbench'],
      status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'Operational',
    }));
  }, [backendRooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.centreName.toLowerCase().includes(q) ||
        r.features.some((f) => f.toLowerCase().includes(q));

      const matchesType = !typeFilter || r.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesCentre = !centreFilter || r.centreName === centreFilter;

      return matchesSearch && matchesType && matchesCentre;
    });
  }, [rooms, search, typeFilter, centreFilter]);

  const total = filteredRooms.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedRooms = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRooms, page]);

  const totalSeats = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);

  const handleAddRoom = (data: {
    name: string;
    code: string;
    centreName: string;
    type: RoomFacility['type'];
    capacity: number;
    features?: string;
  }) => {
    const selectedCentre = centres.find((c) => c.name === data.centreName);

    createRoomMutation.mutate({
      name: data.name.trim(),
      roomNumber: data.code.trim().toUpperCase(),
      centreId: selectedCentre?._id || centres[0]?._id,
      type: data.type.toLowerCase(),
      capacity: Number(data.capacity) || 30,
      equipment: data.features
        ? data.features.split(',').map((f) => f.trim()).filter(Boolean)
        : ['Smart Classroom Equipment'],
      status: 'operational',
      isAvailable: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Rooms & Training Facilities
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage practical workshops, computer laboratories, lecture halls, and physical room capacity.
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
            Add Facility Room
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Facilities
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : rooms.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Seat Capacity
            </span>
            <span className="text-lg font-bold text-foreground">
              {totalSeats}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Laptop className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Computer Labs
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : rooms.filter((r) => r.type.toLowerCase().includes('computer')).length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Practical Studios
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : rooms.filter((r) => r.type.toLowerCase().includes('workshop') || r.type.toLowerCase().includes('bay')).length}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <FacilitiesFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => {
          setTypeFilter(val);
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

      {/* Facilities Table */}
      <FacilitiesTable
        facilities={paginatedRooms}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Add Facility Modal */}
      <AddFacilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        centres={centres}
        onAddFacility={handleAddRoom}
      />
    </div>
  );
}
