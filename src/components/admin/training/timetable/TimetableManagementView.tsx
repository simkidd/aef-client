"use client";

import React, { useState, useMemo } from "react";
import { useSessionsQuery, useCentresQuery, useCohortsQuery } from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import {
  TimetableTable,
  SessionDetailsSheet,
  CancelSessionModal,
  TimetableFilters,
} from "./";
import { TrainingSession } from "@/interfaces";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimetableManagementView() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [centreFilter, setCentreFilter] = useState("");
  const [cohortFilter, setCohortFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [cancellingSession, setCancellingSession] = useState<TrainingSession | null>(null);

  const { data: sessions = [], isLoading, refetch, isFetching } = useSessionsQuery();
  const { data: centres = [] } = useCentresQuery();
  const { data: cohorts = [] } = useCohortsQuery();

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((sess) => {
      const searchLower = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        sess.skillAreaId?.name?.toLowerCase().includes(searchLower) ||
        sess.cohortId?.name?.toLowerCase().includes(searchLower) ||
        sess.centreId?.name?.toLowerCase().includes(searchLower) ||
        sess.roomId?.name?.toLowerCase().includes(searchLower) ||
        `${sess.trainerStaffId?.firstName} ${sess.trainerStaffId?.lastName}`
          .toLowerCase()
          .includes(searchLower);

      const matchesCentre =
        !centreFilter ||
        sess.centreId?._id === centreFilter ||
        sess.centreId === centreFilter;
      const matchesCohort =
        !cohortFilter ||
        sess.cohortId?._id === cohortFilter ||
        sess.cohortId === cohortFilter;

      let matchesStatus = true;
      if (statusFilter === "Cancelled") {
        matchesStatus = Boolean(sess.isCancelled);
      } else if (statusFilter === "Scheduled") {
        matchesStatus = !sess.isCancelled;
      } else if (statusFilter === "Completed") {
        matchesStatus =
          !sess.isCancelled && new Date(sess.sessionDate) < new Date();
      }

      return matchesSearch && matchesCentre && matchesCohort && matchesStatus;
    });
  }, [sessions, debouncedSearch, centreFilter, cohortFilter, statusFilter]);

  const totalItems = filteredSessions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedSessions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredSessions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSessions, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCentreChange = (val: string) => {
    setCentreFilter(val);
    setPage(1);
  };

  const handleCohortChange = (val: string) => {
    setCohortFilter(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleViewDetails = (session: TrainingSession) => {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  };

  const handleCancelSession = (session: TrainingSession) => {
    setCancellingSession(session);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCentreFilter("");
    setCohortFilter("");
    setStatusFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Training Timetables & Sessions Matrix
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Data-driven training schedules generated dynamically from cohort skill configs.
            Expected sessions serve as the baseline for the biometric attendance engine.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs h-8 gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh Matrix
        </Button>
      </div>

      {/* Filters */}
      <TimetableFilters
        search={search}
        onSearchChange={handleSearchChange}
        centreFilter={centreFilter}
        onCentreFilterChange={handleCentreChange}
        cohortFilter={cohortFilter}
        onCohortFilterChange={handleCohortChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusChange}
        centres={centres}
        cohorts={cohorts}
        onReset={handleResetFilters}
      />

      {/* Timetable Table */}
      <TimetableTable
        sessions={paginatedSessions}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onCancelSession={handleCancelSession}
        page={page}
        totalPages={totalPages}
        total={totalItems}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Details Sheet */}
      <SessionDetailsSheet
        session={selectedSession}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedSession(null);
        }}
      />

      {/* Cancel Modal */}
      <CancelSessionModal
        session={cancellingSession}
        isOpen={!!cancellingSession}
        onClose={() => setCancellingSession(null)}
      />
    </div>
  );
}
