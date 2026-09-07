'use client';

import React, { useState, useMemo } from 'react';
import {
  Handshake,
  Plus,
  DollarSign,
  Briefcase,
  Building,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePartnersQuery } from '@/hooks/queries/useStaffQueries';
import { useCreatePartnerMutation } from '@/hooks/mutations/useStaffMutations';
import { AddPartnerModal } from './AddPartnerModal';
import { PartnersFilters } from './PartnersFilters';
import { PartnersTable } from './PartnersTable';
import { Partner } from '@/interfaces';

const ITEMS_PER_PAGE = 10;

export function PartnersView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: backendPartners = [], isLoading, refetch, isFetching } = usePartnersQuery();
  const createPartnerMutation = useCreatePartnerMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
    },
  });

  // Map backend partners to UI structure
  const partners: Partner[] = useMemo(() => {
    return backendPartners.map((p: any) => ({
      _id: p._id,
      code: p.code || '',
      name: p.name || 'Partner Organization',
      type: p.type ? (p.type.charAt(0).toUpperCase() + p.type.slice(1)) : 'Corporate',
      contactPerson: typeof p.contactPerson === 'object' && p.contactPerson
        ? {
            name: p.contactPerson.name || 'Representative',
            title: p.contactPerson.title || '',
            email: p.contactPerson.email || p.email || '',
            phone: p.contactPerson.phone || p.phone || '',
          }
        : {
            name: p.contactPerson || 'Representative',
            title: '',
            email: p.email || '',
            phone: p.phone || '',
          },
      email: p.email || (typeof p.contactPerson === 'object' ? p.contactPerson?.email : '') || '',
      phone: p.phone || (typeof p.contactPerson === 'object' ? p.contactPerson?.phone : '') || '',
      website: p.website || '',
      address: p.address || '',
      state: p.state || '',
      notes: p.notes || '',
      status: p.status ? (p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()) : 'Active',
    }));
  }, [backendPartners]);

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const q = search.toLowerCase().trim();
      const contactName =
        typeof p.contactPerson === 'object' && p.contactPerson
          ? p.contactPerson.name
          : (p.contactPerson as string) || '';

      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        contactName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q);

      const matchesType = !typeFilter || p.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = !statusFilter || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [partners, search, typeFilter, statusFilter]);

  const total = filteredPartners.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedPartners = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPartners.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPartners, page]);

  const handleAddPartner = (data: {
    name: string;
    type: string;
    contactPerson: string;
    email: string;
    phone?: string;
    contribution?: string;
    website?: string;
  }) => {
    createPartnerMutation.mutate({
      name: data.name,
      code: data.name.slice(0, 4).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900),
      type: data.type.toLowerCase(),
      contactPerson: {
        name: data.contactPerson,
        title: 'Liaison Lead',
        email: data.email,
        phone: data.phone || '+234 800 000 0000',
      },
      email: data.email,
      phone: data.phone,
      website: data.website,
      notes: data.contribution,
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Partner Alliances & Sponsors
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage industry partners, corporate sponsors, and government stakeholders
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
            Sync
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs h-9 font-semibold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Partner / Sponsor
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Handshake className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Partners
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : partners.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Sponsors & Funders
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : partners.filter((p) => p.type === 'Sponsor' || p.type === 'Funding agency').length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Corporate & Hiring
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : partners.filter((p) => p.type === 'Corporate' || p.type === 'Employer').length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Govt Alliances
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : partners.filter((p) => p.type === 'Government' || p.type === 'Government agency').length}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <PartnersFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => {
          setTypeFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onReset={() => setPage(1)}
      />

      {/* Partners Table */}
      <PartnersTable
        partners={paginatedPartners}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPartner={handleAddPartner}
      />
    </div>
  );
}
