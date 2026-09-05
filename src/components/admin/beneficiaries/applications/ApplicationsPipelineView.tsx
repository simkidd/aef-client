"use client";

import React, { useState } from "react";
import { useApplicationsQuery } from "@/hooks/queries";
import { Application } from "@/interfaces";
import {
  ApplicationsFilters,
  ApplicationsTable,
  ReviewApplicationModal,
} from "./";

export function ApplicationsPipelineView() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: applications, isLoading } = useApplicationsQuery({
    status: statusFilter || undefined,
    search: search || undefined,
  });

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
      </div>

      {/* Filter Toolbar */}
      <ApplicationsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={() => {
          setSearch("");
          setStatusFilter("");
        }}
      />

      {/* Applications Table */}
      <ApplicationsTable
        applications={applications || []}
        isLoading={isLoading}
        onOpenReview={handleOpenReview}
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
