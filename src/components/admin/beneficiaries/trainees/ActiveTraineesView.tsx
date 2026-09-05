"use client";

import React, { useState } from "react";
import { useEnrollmentQueueQuery } from "@/hooks/queries";
import { Enrollment } from "@/interfaces";
import {
  TraineesFilters,
  TraineesTable,
  DropTraineeModal,
} from "./";

export function ActiveTraineesView() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<Enrollment | null>(
    null
  );
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  const { data: trainees, isLoading } = useEnrollmentQueueQuery({
    status: "Active",
    search: search || undefined,
    skillArea: trackFilter || undefined,
  });

  const handleOpenDrop = (t: Enrollment) => {
    setSelectedTrainee(t);
    setIsDropModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Active Enrolled Trainees
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Active trainees currently undergoing practical training across
            cohorts. Trainees removed from cohorts are transitioned cleanly with
            permanent audit preservation, freeing up capacity for replacement
            candidates.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <TraineesFilters
        search={search}
        onSearchChange={setSearch}
        trackFilter={trackFilter}
        onTrackFilterChange={setTrackFilter}
        onReset={() => {
          setSearch("");
          setTrackFilter("");
        }}
      />

      {/* Trainees Table */}
      <TraineesTable
        trainees={trainees || []}
        isLoading={isLoading}
        onOpenDrop={handleOpenDrop}
      />

      {/* Drop Trainee Modal */}
      <DropTraineeModal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        trainee={selectedTrainee}
      />
    </div>
  );
}
