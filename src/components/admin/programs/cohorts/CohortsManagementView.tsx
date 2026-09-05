"use client";

import React, { useState } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cohort } from "@/interfaces";
import {
  useCohortsQuery,
  useProgramsQuery,
  useCentresQuery,
  useSkillAreasQuery,
} from "@/hooks";
import { CohortsFilters } from "./CohortsFilters";
import { CohortCard } from "./CohortCard";
import { AddCohortModal } from "./AddCohortModal";
import { EditCohortModal } from "./EditCohortModal";
import { CohortDetailsSheet } from "./CohortDetailsSheet";

export function CohortsManagementView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [centreFilter, setCentreFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  const { data: cohorts = [], isLoading } = useCohortsQuery();
  const { data: programs = [] } = useProgramsQuery();
  const { data: centres = [] } = useCentresQuery();
  const { data: skillAreas = [] } = useSkillAreasQuery();

  // Filter cohorts
  const filteredCohorts = cohorts.filter((c) => {
    const progId =
      typeof c.programId === "string" ? c.programId : c.programId?._id;
    const ctrId =
      typeof c.centreId === "string" ? c.centreId : c.centreId?._id;
    const centreName = c.centreId?.name || "";
    const progTitle = c.programId?.title || "";

    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cohortCode.toLowerCase().includes(search.toLowerCase()) ||
      centreName.toLowerCase().includes(search.toLowerCase()) ||
      progTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || c.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesCentre = !centreFilter || ctrId === centreFilter;

    const matchesProgram = !programFilter || progId === programFilter;

    return matchesSearch && matchesStatus && matchesCentre && matchesProgram;
  });

  const handleOpenDetails = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setIsEditModalOpen(true);
  };

  const suggestedCode = `COH-${
    centres[0]?.centreCode?.split("-").pop() || "LAG"
  }-0${cohorts.length + 1}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Cohorts & Capacity Slot Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure multi-skill training cohorts per centre. A single cohort
            can host different skill tracks with distinct timetable rules,
            trainers, and practical lab assignments.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Cohort
        </Button>
      </div>

      {/* Filters */}
      <CohortsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        centreFilter={centreFilter}
        onCentreFilterChange={setCentreFilter}
        programFilter={programFilter}
        onProgramFilterChange={setProgramFilter}
        centres={centres}
        programs={programs}
      />

      {/* Cohorts Grid */}
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
      ) : filteredCohorts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCohorts.map((cohort) => (
            <CohortCard
              key={cohort._id}
              cohort={cohort}
              onOpenDetails={handleOpenDetails}
              onOpenEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">
          <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-foreground">
            No cohorts found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query, centre, program, or status filter.
          </p>
        </Card>
      )}

      {/* Add Cohort Modal */}
      <AddCohortModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        programs={programs}
        centres={centres}
        skillAreas={skillAreas}
        suggestedCode={suggestedCode}
      />

      {/* Edit Cohort Modal */}
      <EditCohortModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cohort={selectedCohort}
        programs={programs}
        centres={centres}
        skillAreas={skillAreas}
      />

      {/* Cohort Details Sheet */}
      <CohortDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        cohort={selectedCohort}
        onOpenEdit={handleOpenEdit}
      />
    </div>
  );
}
