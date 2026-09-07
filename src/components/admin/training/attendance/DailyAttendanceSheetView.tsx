"use client";

import React, { useState, useMemo } from "react";
import {
  useAttendanceSheetQuery,
  useCentresQuery,
  useCohortsQuery,
} from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import {
  AttendanceFilters,
  AttendanceTable,
  AttendanceDetailsSheet,
  AttendanceCorrectionModal,
} from "./";
import { AttendanceRecord } from "@/interfaces";
import Link from "next/link";
import { RefreshCw, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export function DailyAttendanceSheetView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [centreFilter, setCentreFilter] = useState("");
  const [cohortFilter, setCohortFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [correctingRecord, setCorrectingRecord] =
    useState<AttendanceRecord | null>(null);

  const {
    data: attendanceSheet = [],
    isLoading,
    refetch,
    isFetching,
  } = useAttendanceSheetQuery({
    centreId: centreFilter || undefined,
    cohortId: cohortFilter || undefined,
    status: statusFilter || undefined,
    year: yearFilter || undefined,
    month: monthFilter || undefined,
  });

  const { data: centres = [] } = useCentresQuery();
  const { data: cohorts = [] } = useCohortsQuery();

  // Client search & date filter on records
  const filteredRecords = useMemo(() => {
    return attendanceSheet.filter((rec) => {
      // Month/Year client-side validation if needed
      if (yearFilter && rec.date) {
        const recYear = new Date(rec.date).getFullYear().toString();
        if (recYear !== yearFilter) return false;
      }
      if (monthFilter && rec.date) {
        const recMonth = (new Date(rec.date).getMonth() + 1).toString();
        if (recMonth !== monthFilter) return false;
      }

      if (!debouncedSearch) return true;
      const searchLower = debouncedSearch.toLowerCase().trim();
      return (
        `${rec.beneficiaryId?.firstName} ${rec.beneficiaryId?.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        rec.beneficiaryId?.beneficiaryCode
          ?.toLowerCase()
          .includes(searchLower) ||
        rec.skillAreaId?.name?.toLowerCase().includes(searchLower) ||
        rec.cohortId?.name?.toLowerCase().includes(searchLower)
      );
    });
  }, [attendanceSheet, debouncedSearch, yearFilter, monthFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / ITEMS_PER_PAGE),
  );
  const paginatedRecords = filteredRecords.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleViewDetails = (rec: AttendanceRecord) => {
    setSelectedRecord(rec);
    setIsDetailsOpen(true);
  };

  const handleOpenCorrection = (rec: AttendanceRecord) => {
    setCorrectingRecord(rec);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCentreFilter("");
    setCohortFilter("");
    setStatusFilter("");
    setYearFilter("");
    setMonthFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Daily Attendance Sheet & Corrections
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Biometric attendance records calculated against scheduled timetable
            sessions. Manual corrections require an explicit justification and
            are permanently recorded in the audit trail.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Link href="/terminal" className="inline-flex">
            <Button
              size="sm"
              className="text-xs h-8 gap-1.5 font-semibold bg-primary text-primary-foreground shadow-xs whitespace-nowrap"
            >
              <Fingerprint className="h-3.5 w-3.5" />
              Launch Attendance Terminal
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Toolbar */}
      <AttendanceFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        yearFilter={yearFilter}
        onYearFilterChange={(val) => {
          setYearFilter(val);
          setPage(1);
        }}
        monthFilter={monthFilter}
        onMonthFilterChange={(val) => {
          setMonthFilter(val);
          setPage(1);
        }}
        centreFilter={centreFilter}
        onCentreFilterChange={(val) => {
          setCentreFilter(val);
          setPage(1);
        }}
        cohortFilter={cohortFilter}
        onCohortFilterChange={(val) => {
          setCohortFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        centres={centres}
        cohorts={cohorts}
        onReset={handleResetFilters}
      />

      {/* Attendance Table */}
      <AttendanceTable
        records={paginatedRecords}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onOpenCorrection={handleOpenCorrection}
        page={page}
        totalPages={totalPages}
        total={filteredRecords.length}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Details Sheet */}
      <AttendanceDetailsSheet
        record={selectedRecord}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedRecord(null);
        }}
        onOpenCorrection={(rec) => {
          setIsDetailsOpen(false);
          setSelectedRecord(null);
          setCorrectingRecord(rec);
        }}
      />

      {/* Correction Modal */}
      <AttendanceCorrectionModal
        record={correctingRecord}
        isOpen={!!correctingRecord}
        onClose={() => setCorrectingRecord(null)}
      />
    </div>
  );
}
