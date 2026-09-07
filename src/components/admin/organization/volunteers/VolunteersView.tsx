'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCentresQuery } from '@/hooks/queries/useCentreQueries';
import { useVolunteersQuery } from '@/hooks/queries/useStaffQueries';
import { useCreateVolunteerMutation } from '@/hooks/mutations/useStaffMutations';
import { AddVolunteerModal } from './AddVolunteerModal';
import { VolunteersFilters } from './VolunteersFilters';
import { VolunteersTable } from './VolunteersTable';
import { Volunteer } from './VolunteerDetailsSheet';

const ITEMS_PER_PAGE = 10;

export function VolunteersView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [centreFilter, setCentreFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: centres = [] } = useCentresQuery();
  const { data: backendVolunteers = [], isLoading, refetch, isFetching } = useVolunteersQuery();
  const createVolunteerMutation = useCreateVolunteerMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
    },
  });

  // Map backend volunteers to UI structure
  const volunteers: Volunteer[] = useMemo(() => {
    return backendVolunteers.map((v: any) => ({
      id: v._id,
      code: v.volunteerCode || '',
      name: `${v.firstName || ''} ${v.lastName || ''}`.trim() || 'Volunteer Member',
      email: v.email || '',
      phone: v.phone || '',
      role: v.responsibilities || 'Community Skills Volunteer',
      centre: v.assignedCentreId?.name || (typeof v.assignedCentreId === 'string' ? v.assignedCentreId : 'Central Hub'),
      hoursLogged: v.hoursLogged || 0,
      status: (v.status ? v.status.charAt(0).toUpperCase() + v.status.slice(1).toLowerCase() : 'Active') as any,
      skills: v.skills || ['Community Engagement'],
      joinedDate: v.startDate ? new Date(v.startDate).toISOString().split('T')[0] : '2026-01-01',
    }));
  }, [backendVolunteers]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.role.toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q));

      const matchesStatus =
        !statusFilter ||
        v.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesCentre = !centreFilter || v.centre === centreFilter;
      return matchesSearch && matchesStatus && matchesCentre;
    });
  }, [volunteers, search, statusFilter, centreFilter]);

  const total = filteredVolunteers.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedVolunteers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredVolunteers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVolunteers, page]);

  const totalHours = volunteers.reduce((acc, v) => acc + (v.hoursLogged || 0), 0);
  const activeCount = volunteers.filter((v) => v.status === 'Active' || v.status === 'active' as any).length;

  const handleAddVolunteer = (data: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    centre: string;
    skills?: string;
  }) => {
    const parts = data.name.trim().split(' ');
    const firstName = parts[0] || 'Volunteer';
    const lastName = parts.slice(1).join(' ') || 'Member';

    // Find centre ID if possible
    const selectedCentre = centres.find((c) => c.name === data.centre);

    createVolunteerMutation.mutate({
      firstName,
      lastName,
      email: data.email.trim(),
      phone: data.phone?.trim() || '+234 800 000 0000',
      gender: 'other',
      responsibilities: data.role?.trim() || 'Community Skills Volunteer',
      assignedCentreId: selectedCentre?._id,
      skills: data.skills
        ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Community Engagement'],
      status: 'active',
      startDate: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Volunteers & Community Corps
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage grassroots volunteers, track volunteer service hours, and coordinate community skills trainers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
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
            Register Volunteer
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Volunteers
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : volunteers.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Active in Field
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : activeCount}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Hours Logged
            </span>
            <span className="text-lg font-bold text-foreground">
              {totalHours} hrs
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Active Tracks
            </span>
            <span className="text-lg font-bold text-foreground">
              4 Tracks
            </span>
          </div>
        </Card>
      </div>

      {/* Filters Bar */}
      <VolunteersFilters
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
        centreFilter={centreFilter}
        onCentreFilterChange={(val) => {
          setCentreFilter(val);
          setPage(1);
        }}
        centres={centres}
        onReset={() => setPage(1)}
      />

      {/* Volunteers Table */}
      <VolunteersTable
        volunteers={paginatedVolunteers}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Add Volunteer Modal */}
      <AddVolunteerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        centres={centres}
        onAddVolunteer={handleAddVolunteer}
      />
    </div>
  );
}
