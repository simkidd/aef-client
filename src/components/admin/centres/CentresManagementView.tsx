"use client";

import React, { useState } from "react";
import { Plus, Building2, Users, DoorOpen, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrainingCentre } from "@/interfaces";
import { useCentresQuery, useStaffListQuery } from "@/hooks";
import { CentresFilters } from "./CentresFilters";
import { CentreCard } from "./CentreCard";
import { AddCentreModal } from "./AddCentreModal";
import { EditCentreModal } from "./EditCentreModal";
import { CentreDetailsSheet } from "./CentreDetailsSheet";

export function CentresManagementView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState<TrainingCentre | null>(
    null
  );

  const { data: centres = [], isLoading } = useCentresQuery();
  const { data: staffList = [] } = useStaffListQuery();

  // Filtered centres
  const filteredCentres = centres.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.centreCode.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.lga.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      c.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level KPIs
  const totalCapacity = centres.reduce((acc, c) => acc + (c.capacity || 0), 0);
  const totalRooms = centres.reduce(
    (acc, c) => acc + (c.stats?.rooms || 0),
    0
  );
  const totalDevices = centres.reduce(
    (acc, c) => acc + (c.stats?.devices || 0),
    0
  );

  const handleOpenDetails = (centre: TrainingCentre) => {
    setSelectedCentre(centre);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (centre: TrainingCentre) => {
    setSelectedCentre(centre);
    setIsEditModalOpen(true);
  };

  const suggestedCode = `AEF-CTR-0${centres.length + 1}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Training Centres & Facilities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centrally manage accredited Adele Foundation training centres, room
            capacities, biometric terminals, and physical infrastructure.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Training Centre
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Accredited Centres
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? "..." : centres.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Seat Capacity
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? "..." : totalCapacity.toLocaleString()}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <DoorOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Rooms & Labs
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? "..." : totalRooms}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Biometric Hardware
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? "..." : totalDevices}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <CentresFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Centres Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-8 text-center animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mx-auto mb-4" />
              <div className="h-3 bg-muted rounded w-2/3 mx-auto mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
            </Card>
          ))}
        </div>
      ) : filteredCentres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((centre) => (
            <CentreCard
              key={centre._id}
              centre={centre}
              onOpenDetails={handleOpenDetails}
              onOpenEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-foreground">
            No training centres found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or status filter.
          </p>
        </Card>
      )}

      {/* Add Centre Modal */}
      <AddCentreModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        staffList={staffList}
        suggestedCode={suggestedCode}
      />

      {/* Edit Centre Modal */}
      <EditCentreModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        centre={selectedCentre}
        staffList={staffList}
      />

      {/* Centre Details Sheet */}
      <CentreDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        centre={selectedCentre}
        onOpenEdit={handleOpenEdit}
      />
    </div>
  );
}
