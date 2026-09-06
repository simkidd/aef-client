"use client";

import React, { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarFilters } from "./CalendarFilters";
import { CalendarEventsTable } from "./CalendarEventsTable";
import { CalendarEventDetailsSheet } from "./CalendarEventDetailsSheet";
import { AddCalendarEventModal } from "./AddCalendarEventModal";
import {
  useSessionsQuery,
  useCentresQuery,
  useCohortsQuery,
} from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import { TrainingSession } from "@/interfaces/program.interface";

const ITEMS_PER_PAGE = 10;

export const TrainingCalendarView: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [selectedCohort, setSelectedCohort] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [selectedEvent, setSelectedEvent] = useState<TrainingSession | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: sessions = [],
    isLoading,
    refetch,
    isFetching,
  } = useSessionsQuery();
  const { data: centres = [] } = useCentresQuery();
  const { data: cohorts = [] } = useCohortsQuery();

  // Filtered events
  const filteredEvents = useMemo(() => {
    return sessions.filter((event) => {
      const searchLower = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        debouncedSearch === "" ||
        event.topic?.toLowerCase().includes(searchLower) ||
        event.skillAreaId?.name?.toLowerCase().includes(searchLower) ||
        event.cohortId?.name?.toLowerCase().includes(searchLower) ||
        event.centreId?.name?.toLowerCase().includes(searchLower) ||
        `${event.trainerStaffId?.firstName || ""} ${event.trainerStaffId?.lastName || ""}`
          .toLowerCase()
          .includes(searchLower);

      const matchesCentre =
        selectedCentre === "all" ||
        event.centreId?._id === selectedCentre ||
        event.centreId?.id === selectedCentre ||
        event.centreId === selectedCentre;

      const matchesCohort =
        selectedCohort === "all" ||
        event.cohortId?._id === selectedCohort ||
        event.cohortId?.id === selectedCohort ||
        event.cohortId === selectedCohort;

      const matchesType =
        selectedType === "all" ||
        event.sessionType?.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesCentre && matchesCohort && matchesType;
    });
  }, [sessions, debouncedSearch, selectedCentre, selectedCohort, selectedType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / ITEMS_PER_PAGE),
  );
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCentre("all");
    setSelectedCohort("all");
    setSelectedType("all");
    setPage(1);
  };

  const handleViewEvent = (event: TrainingSession) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Training Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Master schedule of all lectures, workshops, practical labs, and
            assessments across hubs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-border text-foreground hover:bg-muted"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <CalendarFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        selectedCentre={selectedCentre}
        onCentreChange={(val) => {
          setSelectedCentre(val);
          setPage(1);
        }}
        selectedCohort={selectedCohort}
        onCohortChange={(val) => {
          setSelectedCohort(val);
          setPage(1);
        }}
        selectedType={selectedType}
        onTypeChange={(val) => {
          setSelectedType(val);
          setPage(1);
        }}
        centres={centres}
        cohorts={cohorts}
        onReset={handleResetFilters}
      />

      {/* Calendar / Sessions Table */}
      <Card className="border-border bg-card overflow-hidden py-0">
        <CalendarEventsTable
          events={paginatedEvents}
          isLoading={isLoading}
          onViewEvent={handleViewEvent}
          page={page}
          totalPages={totalPages}
          total={filteredEvents.length}
          limit={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      </Card>

      {/* Event Details Sheet */}
      <CalendarEventDetailsSheet
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Schedule Modal */}
      <AddCalendarEventModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        centres={centres}
        cohorts={cohorts}
        onEventCreated={() => refetch()}
      />
    </div>
  );
};
