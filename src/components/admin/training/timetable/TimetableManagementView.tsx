"use client";

import React, { useState, useMemo } from "react";
import {
  useSessionsQuery,
  useCentresQuery,
  useCohortsQuery,
  useSkillAreasQuery,
} from "@/hooks/queries";
import {
  useDebounce,
  usePublishTimetableMutation,
  useUnpublishTimetableMutation,
} from "@/hooks";
import {
  TimetableTable,
  SessionDetailsSheet,
  CancelSessionModal,
  DraftTimetableModal,
  TimetableFilters,
} from "./";
import { TrainingSession } from "@/interfaces";
import { RefreshCw, Layers, Send, EyeOff, Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
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
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const { data: sessions = [], isLoading, refetch, isFetching } = useSessionsQuery();
  const { data: centres = [] } = useCentresQuery();
  const { data: cohorts = [] } = useCohortsQuery();
  const { data: skillAreas = [] } = useSkillAreasQuery();

  const publishMutation = usePublishTimetableMutation();
  const unpublishMutation = useUnpublishTimetableMutation();

  const selectedCohort = cohorts.find((c) => c._id === cohortFilter);

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
            Draft and manage 2 to 3 session slots per day with customizable start times and assigned skill tracks. Trainees only see schedules once published.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsDraftModalOpen(true)}
            className="text-xs h-8 gap-1.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
          >
            <Layers className="h-3.5 w-3.5" />
            Draft Timetable
          </Button>
        </div>
      </div>

      {/* Cohort Timetable Lifecycle Status Card */}
      {selectedCohort && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            selectedCohort.timetableStatus === "published"
              ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40"
              : "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                selectedCohort.timetableStatus === "published"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}
            >
              {selectedCohort.timetableStatus === "published" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {selectedCohort.name} ({selectedCohort.cohortCode})
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    selectedCohort.timetableStatus === "published"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                  }`}
                >
                  {selectedCohort.timetableStatus === "published"
                    ? "Published (Visible on Portal)"
                    : "Draft Mode (Hidden from Trainees)"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedCohort.timetableStatus === "published"
                  ? "Trainees can currently view their session schedule and classroom instructions."
                  : "This timetable is in draft mode. Trainees will see a 'draft in progress' notice until you publish."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDraftModalOpen(true)}
              className="text-xs h-8 gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              Edit Slots
            </Button>

            {selectedCohort.timetableStatus === "published" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => unpublishMutation.mutate(selectedCohort._id)}
                disabled={unpublishMutation.isPending}
                className="text-xs h-8 gap-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-300 dark:border-amber-800"
              >
                {unpublishMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                Revert to Draft
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => publishMutation.mutate(selectedCohort._id)}
                disabled={publishMutation.isPending}
                className="text-xs h-8 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold shadow-2xs"
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Publish to Trainees
              </Button>
            )}
          </div>
        </div>
      )}

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

      {/* Draft Timetable Modal */}
      <DraftTimetableModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        cohorts={cohorts}
        skillAreas={skillAreas}
        centres={centres}
        defaultCohortId={cohortFilter || cohorts[0]?._id}
      />
    </div>
  );
}

