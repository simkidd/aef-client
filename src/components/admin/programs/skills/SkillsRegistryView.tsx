"use client";

import React, { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkillArea } from "@/interfaces";
import { useSkillAreasQuery } from "@/hooks";
import { useDebounce } from "@/hooks";
import { SkillsFilters } from "./SkillsFilters";
import { SkillsTable } from "./SkillsTable";
import { AddSkillModal } from "./AddSkillModal";
import { EditSkillModal } from "./EditSkillModal";
import { SkillDetailsSheet } from "./SkillDetailsSheet";

const ITEMS_PER_PAGE = 10;

export function SkillsRegistryView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillArea | null>(null);

  const {
    data: skills = [],
    isLoading,
    refetch,
    isFetching,
  } = useSkillAreasQuery();

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const searchLower = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !debouncedSearch ||
        s.name.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower) ||
        s.description?.toLowerCase().includes(searchLower);

      const matchesCategory = !categoryFilter || s.category === categoryFilter;

      const matchesStatus =
        !statusFilter || (statusFilter === "active" ? s.isActive : !s.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [skills, debouncedSearch, categoryFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSkills.length / ITEMS_PER_PAGE),
  );
  const paginatedSkills = filteredSkills.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleOpenDetails = (skill: SkillArea) => {
    setSelectedSkill(skill);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (skill: SkillArea) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const suggestedCode = `SKL-0${skills.length + 1}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Skill Areas Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reusable technical curriculum disciplines. A single skill area can
            be integrated across multiple programs and training centres without
            duplication.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-border text-foreground hover:bg-muted text-xs"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Skill Area
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SkillsFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(val) => {
          setCategoryFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
      />

      {/* Skills Table Card */}
      <Card className="overflow-hidden border-border py-0">
        <SkillsTable
          skills={paginatedSkills}
          isLoading={isLoading}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
          page={page}
          totalPages={totalPages}
          total={filteredSkills.length}
          limit={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      </Card>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        suggestedCode={suggestedCode}
      />

      {/* Edit Skill Modal */}
      <EditSkillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        skill={selectedSkill}
      />

      {/* Skill Details Sheet */}
      <SkillDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        skill={selectedSkill}
        onOpenEdit={handleOpenEdit}
      />
    </div>
  );
}

