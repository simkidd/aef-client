'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Download,
  ShieldCheck,
  FolderOpen,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDocumentsQuery } from '@/hooks/queries/useCentreQueries';
import { useCreateDocumentMutation } from '@/hooks/mutations/useCentreMutations';
import { AddDocumentModal } from './AddDocumentModal';
import { DocumentsFilters } from './DocumentsFilters';
import { DocumentsTable } from './DocumentsTable';
import { DocRecord } from './DocumentDetailsSheet';
import { toast } from '@/components/ui/toast';

const ITEMS_PER_PAGE = 10;

export function DocumentsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [accessFilter, setAccessFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: backendDocs = [], isLoading, refetch, isFetching } = useDocumentsQuery();
  const createDocMutation = useCreateDocumentMutation({
    onSuccess: () => {
      setIsAddModalOpen(false);
    },
  });

  // Map backend documents to UI structure
  const docs: DocRecord[] = useMemo(() => {
    return backendDocs.map((d: any) => ({
      id: d._id,
      title: d.title || 'Foundation Policy Document',
      category: d.category ? (d.category.charAt(0).toUpperCase() + d.category.slice(1)) : 'Policy & Governance',
      fileType: d.fileType ? d.fileType.toUpperCase() : 'PDF',
      fileSize: d.fileSize || '1.5 MB',
      accessLevel: (d.accessLevel || 'Staff Only') as any,
      lastUpdated: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : '2026-01-01',
      downloadsCount: d.downloadsCount || 0,
    }));
  }, [backendDocs]);

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q);

      const matchesCat = !catFilter || d.category.toLowerCase().includes(catFilter.toLowerCase());
      const matchesAccess = !accessFilter || d.accessLevel.toLowerCase() === accessFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesAccess;
    });
  }, [docs, search, catFilter, accessFilter]);

  const total = filteredDocs.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDocs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDocs, page]);

  const handleDownload = (doc: DocRecord) => {
    toast.add({
      title: 'Downloading Document',
      description: `Dispatched download for "${doc.title}".`,
      type: 'success',
    });
  };

  const handleAddDoc = (data: {
    title: string;
    category: DocRecord['category'];
    fileType: DocRecord['fileType'];
    accessLevel: DocRecord['accessLevel'];
  }) => {
    createDocMutation.mutate({
      title: data.title.trim(),
      category: data.category.toLowerCase(),
      fileType: data.fileType,
      accessLevel: data.accessLevel,
      fileSize: '1.5 MB',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Documents & Policies Repository
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Central library for foundation policies, standard operating procedures, training curriculums, and legal compliance filings.
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
            Upload Document
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Documents
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : docs.length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Curriculums & Guides
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : docs.filter((d) => d.category.toLowerCase().includes('curriculum') || d.category.toLowerCase().includes('training')).length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Policies & Governance
            </span>
            <span className="text-lg font-bold text-foreground">
              {isLoading ? '...' : docs.filter((d) => d.category.toLowerCase().includes('policy') || d.category.toLowerCase().includes('governance')).length}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-medium block">
              Total Downloads
            </span>
            <span className="text-lg font-bold text-foreground">
              {docs.reduce((acc, d) => acc + (d.downloadsCount || 0), 0)}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <DocumentsFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        catFilter={catFilter}
        onCatFilterChange={(val) => {
          setCatFilter(val);
          setPage(1);
        }}
        accessFilter={accessFilter}
        onAccessFilterChange={(val) => {
          setAccessFilter(val);
          setPage(1);
        }}
        onReset={() => setPage(1)}
      />

      {/* Documents Table */}
      <DocumentsTable
        documents={paginatedDocs}
        isLoading={isLoading}
        onDownload={handleDownload}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* Add Document Modal */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDoc={handleAddDoc}
      />
    </div>
  );
}
