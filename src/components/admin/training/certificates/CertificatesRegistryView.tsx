"use client";

import React, { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CertificatesFilters } from "./CertificatesFilters";
import { CertificatesTable } from "./CertificatesTable";
import { CertificateDetailsSheet } from "./CertificateDetailsSheet";
import { IssueCertificateModal } from "./IssueCertificateModal";
import { useCertificatesQuery } from "@/hooks/queries/useCertificateQueries";
import { useCentresQuery, useCohortsQuery } from "@/hooks/queries";
import { useDebounce } from "@/hooks";
import { Certificate } from "@/interfaces/certificate.interface";

const ITEMS_PER_PAGE = 10;

export const CertificatesRegistryView: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [selectedCohort, setSelectedCohort] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const {
    data: certificatesData,
    isLoading,
    refetch,
    isFetching,
  } = useCertificatesQuery({
    centreId: selectedCentre !== "all" ? selectedCentre : undefined,
    cohortId: selectedCohort !== "all" ? selectedCohort : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const certificates = certificatesData?.docs || [];
  const pagination = certificatesData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const { data: centres = [] } = useCentresQuery();
  const { data: cohorts = [] } = useCohortsQuery();

  // Search filter if client search is typed
  const displayedCertificates = useMemo(() => {
    if (!debouncedSearch) return certificates;
    const searchLower = debouncedSearch.toLowerCase().trim();
    return certificates.filter((cert) => {
      const benName =
        typeof cert.beneficiaryId === "object"
          ? `${cert.beneficiaryId?.firstName || ""} ${cert.beneficiaryId?.lastName || ""}`.trim() ||
            cert.beneficiaryId?.fullName ||
            ""
          : "";

      return (
        cert.certificateNumber?.toLowerCase().includes(searchLower) ||
        cert.verificationCode?.toLowerCase().includes(searchLower) ||
        benName.toLowerCase().includes(searchLower)
      );
    });
  }, [certificates, debouncedSearch]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCentre("all");
    setSelectedCohort("all");
    setSelectedStatus("all");
    setPage(1);
  };

  const handleViewCertificate = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Certificates & Credentials
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage accredited certifications, verify cryptographic hashes, and issue graduate diplomas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-border text-foreground hover:bg-muted"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsIssueModalOpen(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <CertificatesFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        selectedCentre={selectedCentre}
        onCentreChange={(val) => {
          setSelectedCentre(val);
          setPage(1);
        }}
        selectedCohort={selectedCohort}
        onCohortChange={(val) => {
          setSelectedCohort(val);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setPage(1);
        }}
        centres={centres}
        cohorts={cohorts}
        onReset={handleResetFilters}
      />

      {/* Certificates Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CertificatesTable
          certificates={displayedCertificates}
          isLoading={isLoading}
          onViewCertificate={handleViewCertificate}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </Card>

      {/* Certificate Details Sheet */}
      <CertificateDetailsSheet
        certificate={selectedCert}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Issue Modal */}
      <IssueCertificateModal
        isOpen={isIssueModalOpen}
        onOpenChange={setIsIssueModalOpen}
        centres={centres}
        cohorts={cohorts}
        onCertificateIssued={() => refetch()}
      />
    </div>
  );
};
