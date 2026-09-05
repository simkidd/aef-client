"use client";

import React, { useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Program } from "@/interfaces";
import { useProgramsQuery, useSkillAreasQuery } from "@/hooks";
import { ProgramsFilters } from "./ProgramsFilters";
import { ProgramCard } from "./ProgramCard";
import { AddProgramModal } from "./AddProgramModal";
import { EditProgramModal } from "./EditProgramModal";
import { ProgramDetailsSheet } from "./ProgramDetailsSheet";

export function ProgramsManagementView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [organizerTypeFilter, setOrganizerTypeFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const { data: programs = [], isLoading } = useProgramsQuery();
  const { data: skillAreas = [] } = useSkillAreasQuery();

  // Filter programs
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.organizerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || p.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesOrganizer =
      !organizerTypeFilter || p.organizerType === organizerTypeFilter;

    return matchesSearch && matchesStatus && matchesOrganizer;
  });

  const handleOpenDetails = (program: Program) => {
    setSelectedProgram(program);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (program: Program) => {
    setSelectedProgram(program);
    setIsEditModalOpen(true);
  };

  const suggestedCode = `AEF-PROG-2026-0${programs.length + 1}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Programs & Initiatives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage foundation-owned vocational tracks and partner-sponsored
            empowerment initiatives. Adele acts as program designer, accredited
            facilitator, and delivery host.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </div>

      {/* Filters */}
      <ProgramsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        organizerTypeFilter={organizerTypeFilter}
        onOrganizerTypeFilterChange={setOrganizerTypeFilter}
      />

      {/* Programs Grid */}
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
      ) : filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program._id}
              program={program}
              onOpenDetails={handleOpenDetails}
              onOpenEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">
          <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-foreground">
            No programs found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query, status filter, or organizer type.
          </p>
        </Card>
      )}

      {/* Add Program Modal */}
      <AddProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        skillAreas={skillAreas}
        suggestedCode={suggestedCode}
      />

      {/* Edit Program Modal */}
      <EditProgramModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        program={selectedProgram}
        skillAreas={skillAreas}
      />

      {/* Program Details Sheet */}
      <ProgramDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        program={selectedProgram}
        onOpenEdit={handleOpenEdit}
      />
    </div>
  );
}
