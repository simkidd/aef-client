"use client";

import React, { useState } from "react";
import { useEnrollmentQueueQuery } from "@/hooks/queries";
import { Enrollment } from "@/interfaces";
import {
  EnrollmentFilters,
  EnrollmentTable,
  PhysicalVerificationModal,
  BiometricCaptureModal,
} from "./";

export function BiometricRegistrationDeskView() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);

  const { data: queue, isLoading } = useEnrollmentQueueQuery({
    status: statusFilter || undefined,
    search: search || undefined,
  });

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
      </div>

      {/* Filter Toolbar */}
      <EnrollmentFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={() => {
          setSearch("");
          setStatusFilter("");
        }}
      />

      {/* Queue Table */}
      <EnrollmentTable
        queue={queue || []}
        isLoading={isLoading}
        onOpenVerify={handleOpenVerify}
        onOpenBiometric={handleOpenBiometric}
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
