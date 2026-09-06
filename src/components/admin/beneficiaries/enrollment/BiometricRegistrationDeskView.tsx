"use client";

import React, { useState } from "react";
import { useEnrollmentQueueQuery } from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import { Enrollment } from "@/interfaces";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EnrollmentFilters,
  EnrollmentTable,
  PhysicalVerificationModal,
  BiometricCaptureModal,
} from "./";

const ITEMS_PER_PAGE = 10;

export function BiometricRegistrationDeskView() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);

  const {
    data: queueData,
    isLoading,
    refetch,
    isFetching,
  } = useEnrollmentQueueQuery({
    status: statusFilter || undefined,
    search: debouncedSearch.trim() || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const queue = queueData?.docs || [];
  const pagination = queueData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleOpenVerify = (enr: Enrollment) => {
    setSelectedEnrollment(enr);
    setIsVerifyModalOpen(true);
  };

  const handleOpenBiometric = (enr: Enrollment) => {
    setSelectedEnrollment(enr);
    setIsBiometricModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Physical Verification & Biometric Desk
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Onboard selected candidates into active cohorts. Physical identity
            verification and hardware biometric fingerprint enrollment are
            strictly required.
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
          Refresh Queue
        </Button>
      </div>

      {/* Filter Toolbar */}
      <EnrollmentFilters
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

      {/* Queue Table */}
      <EnrollmentTable
        queue={queue}
        isLoading={isLoading}
        onOpenVerify={handleOpenVerify}
        onOpenBiometric={handleOpenBiometric}
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={setPage}
      />

      {/* Step 1: Physical Verification Modal */}
      <PhysicalVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        enrollment={selectedEnrollment}
      />

      {/* Step 2: Biometric Fingerprint Registration Modal */}
      <BiometricCaptureModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        enrollment={selectedEnrollment}
      />
    </div>
  );
}
