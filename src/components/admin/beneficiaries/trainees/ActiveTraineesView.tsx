"use client";

import React, { useState } from "react";
import { useEnrollmentQueueQuery } from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import { Enrollment } from "@/interfaces";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TraineesFilters,
  TraineesTable,
  DropTraineeModal,
} from "./";

const ITEMS_PER_PAGE = 10;

export function ActiveTraineesView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [trackFilter, setTrackFilter] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<Enrollment | null>(
    null
  );
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  const {
    data: traineesData,
    isLoading,
    refetch,
    isFetching,
  } = useEnrollmentQueueQuery({
    status: "Active",
    search: debouncedSearch.trim() || undefined,
    skillArea: trackFilter || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const trainees = traineesData?.docs || [];
  const pagination = traineesData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs h-8 gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Trainees
        </Button>
      </div>

      {/* Filters Toolbar */}
      <TraineesFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        trackFilter={trackFilter}
        onTrackFilterChange={(val) => {
          setTrackFilter(val);
          setPage(1);
        }}
        onReset={() => {
          setSearch("");
          setTrackFilter("");
          setPage(1);
        }}
      />

      {/* Trainees Table */}
      <TraineesTable
        trainees={trainees}
        isLoading={isLoading}
        onOpenDrop={handleOpenDrop}
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
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
