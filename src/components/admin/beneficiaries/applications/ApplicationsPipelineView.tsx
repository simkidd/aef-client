"use client";

import React, { useState } from "react";
import { useApplicationsQuery } from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import { Application } from "@/interfaces";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ApplicationsFilters,
  ApplicationsTable,
  ReviewApplicationModal,
} from "./";

const ITEMS_PER_PAGE = 10;

export function ApplicationsPipelineView() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const {
    data: applicationsData,
    isLoading,
    refetch,
    isFetching,
  } = useApplicationsQuery({
    status: statusFilter || undefined,
    search: debouncedSearch.trim() || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const applications = applicationsData?.docs || [];
  const pagination = applicationsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleOpenReview = (app: Application) => {
    setSelectedApp(app);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Applications Review Pipeline
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review incoming candidate applications. Selecting a candidate
            automatically routes them to the Physical Verification & Biometric
            Registration Queue.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs h-8 gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Pipeline
        </Button>
      </div>

      {/* Filter Toolbar */}
      <ApplicationsFilters
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
        onReset={() => {
          setSearch("");
          setStatusFilter("");
          setPage(1);
        }}
      />

      {/* Applications Table */}
      <ApplicationsTable
        applications={applications}
        isLoading={isLoading}
        onOpenReview={handleOpenReview}
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />

      {/* Review Modal */}
      <ReviewApplicationModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        application={selectedApp}
      />
    </div>
  );
}
