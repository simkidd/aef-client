"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Staff } from "@/interfaces";
import {
  useStaffListQuery,
  useDepartmentsQuery,
  useCentresQuery,
} from "@/hooks";
import { StaffFilters } from "./StaffFilters";
import { StaffTable } from "./StaffTable";
import { AddStaffModal } from "./AddStaffModal";
import { ProvisionAccountModal } from "./ProvisionAccountModal";

export function StaffDirectoryView() {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const { data: staffList = [], isLoading } = useStaffListQuery({
    category: categoryFilter,
    search,
  });

  const { data: departments = [] } = useDepartmentsQuery();
  const { data: centres = [] } = useCentresQuery();

  const handleOpenProvision = (st: Staff) => {
    setSelectedStaff(st);
    setIsProvisionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Staff & Employee Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organization HR registry for all employees (Trainers, Management,
            Operations, Cleaners, Drivers). System login accounts are
            provisioned separately on-demand.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff Record
        </Button>
      </div>

      {/* Filters */}
      <StaffFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {/* Staff Table */}
      <StaffTable
        staffList={staffList}
        isLoading={isLoading}
        onOpenProvision={handleOpenProvision}
      />

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        departments={departments}
        centres={centres}
      />

      {/* Provision Account Modal */}
      <ProvisionAccountModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        staff={selectedStaff}
      />
    </div>
  );
}
