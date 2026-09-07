"use client";

import React, { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Staff } from "@/interfaces";
import {
  useStaffListQuery,
  useCentresQuery,
  useDebounce,
} from "@/hooks";
import { StaffFilters } from "./StaffFilters";
import { StaffTable } from "./StaffTable";
import { AddStaffModal } from "./AddStaffModal";
import { ProvisionAccountModal } from "./ProvisionAccountModal";

const ITEMS_PER_PAGE = 10;

export function StaffDirectoryView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const {
    data: staffData,
    isLoading,
    refetch,
    isFetching,
  } = useStaffListQuery({
    search: debouncedSearch.trim() || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const staffList = staffData?.docs || [];
  const pagination = staffData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

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
            Organization HR registry for all employees. System login accounts are
            provisioned separately on-demand.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs h-8 font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Staff Record
          </Button>
        </div>
      </div>

      {/* Filters */}
      <StaffFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      {/* Staff Table */}
      <StaffTable
        staffList={staffList}
        isLoading={isLoading}
        onOpenProvision={handleOpenProvision}
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
