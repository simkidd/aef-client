'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDepartmentsQuery } from '@/hooks/queries/useOrgQueries';
import { useStaffListQuery } from '@/hooks/queries/useStaffQueries';
import { Department } from '@/interfaces';
import { DepartmentsFilters } from './DepartmentsFilters';
import { DepartmentsTable } from './DepartmentsTable';
import { AddDepartmentModal } from './AddDepartmentModal';
import { EditDepartmentModal } from './EditDepartmentModal';

const ITEMS_PER_PAGE = 10;

export function DepartmentsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const {
    data: departments = [],
    isLoading: isDeptsLoading,
    refetch: refetchDepts,
    isFetching,
  } = useDepartmentsQuery();

  const { data: staffData } = useStaffListQuery({ limit: 100 });
  const staffList = staffData?.docs || [];

  const handleRefresh = () => {
    refetchDepts();
  };

  const handleEditDept = (dept: Department) => {
    setSelectedDept(dept);
    setIsEditModalOpen(true);
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q));

      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'active' ? d.isActive : !d.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const total = filteredDepartments.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedDepartments = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDepartments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDepartments, page]);

  const activeCount = departments.filter((d) => d.isActive).length;
  const assignedHodCount = departments.filter((d) => d.headOfDepartmentId).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Departments & Units
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage organizational structure, operational departments, and appointed leadership.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs h-9 font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Departments
            </span>
            <span className="text-lg font-bold text-foreground">
              {isDeptsLoading ? '...' : departments.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Active Units
            </span>
            <span className="text-lg font-bold text-foreground">
              {isDeptsLoading ? '...' : activeCount}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Assigned HODs
            </span>
            <span className="text-lg font-bold text-foreground">
              {isDeptsLoading ? '...' : assignedHodCount}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Staff Members
            </span>
            <span className="text-lg font-bold text-foreground">
              {staffList.length}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <DepartmentsFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onReset={() => setPage(1)}
      />

      {/* Departments Table */}
      <DepartmentsTable
        departments={paginatedDepartments}
        isLoading={isDeptsLoading}
        onOpenEdit={handleEditDept}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Add Modal */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        staffList={staffList}
      />

      {/* Edit Modal */}
      <EditDepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        department={selectedDept}
        staffList={staffList}
      />
    </div>
  );
}
