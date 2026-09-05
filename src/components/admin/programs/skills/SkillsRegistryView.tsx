"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkillArea } from "@/interfaces";
import { useSkillAreasQuery } from "@/hooks";
import { SkillsFilters } from "./SkillsFilters";
import { SkillsTable } from "./SkillsTable";
import { AddSkillModal } from "./AddSkillModal";
import { EditSkillModal } from "./EditSkillModal";
import { SkillDetailsSheet } from "./SkillDetailsSheet";

export function SkillsRegistryView() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillArea | null>(null);

  const { data: skills = [], isLoading } = useSkillAreasQuery();

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !categoryFilter || s.category === categoryFilter;

    const matchesStatus =
      !statusFilter || (statusFilter === "active" ? s.isActive : !s.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill Area
        </Button>
      </div>

      {/* Filters */}
      <SkillsFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Skills Table Card */}
      <Card className="overflow-hidden border-border py-0">
        <SkillsTable
          skills={filteredSkills}
          isLoading={isLoading}
          onOpenDetails={handleOpenDetails}
          onOpenEdit={handleOpenEdit}
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
