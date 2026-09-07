"use client";

import React, { useState, useMemo } from "react";
import { useAuditLogsQuery } from "@/hooks/queries/useAdminQueries";
import { useDebounce } from "@/hooks";
import { AuditFilters } from "./AuditFilters";
import { AuditTable } from "./AuditTable";
import { AuditStateDiffModal } from "./AuditStateDiffModal";
import { MetricCard } from "@/components/common/MetricCard";
import { AuditLog } from "@/interfaces";
import {
  History,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  FileCheck2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const DEFAULT_ACTIONS = [
  "ATTENDANCE_MANUALLY_CORRECTED",
  "APPLICATION_STATUS_UPDATED",
  "BENEFICIARY_REGISTERED",
  "TRAINEE_ENROLLED",
  "BIOMETRIC_IDENTITY_ENROLLED",
  "CERTIFICATE_ISSUED",
  "ROLE_PERMISSIONS_MODIFIED",
  "USER_ROLE_SCOPE_UPDATED",
  "SETTINGS_UPDATED",
];

const DEFAULT_ENTITIES = [
  "AttendanceRecord",
  "Application",
  "Beneficiary",
  "Enrollment",
  "BiometricIdentity",
  "Certificate",
  "Role",
  "User",
  "Setting",
];

export function AuditTrailExplorerView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Server-side query with active search, filters, and pagination
  const {
    data: auditResult,
    isLoading,
    refetch,
    isFetching,
  } = useAuditLogsQuery({
    search: debouncedSearch || undefined,
    action: actionFilter || undefined,
    entityType: entityFilter || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const logs = auditResult?.logs || [];
  const pagination = auditResult?.pagination || {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  };

  // Filter dropdown options
  const actionOptions = useMemo(() => {
    const set = new Set<string>(DEFAULT_ACTIONS);
    logs.forEach((l: AuditLog) => {
      if (l.action) set.add(l.action);
    });
    return Array.from(set).sort();
  }, [logs]);

  const entityOptions = useMemo(() => {
    const set = new Set<string>(DEFAULT_ENTITIES);
    logs.forEach((l: AuditLog) => {
      if (l.entityType) set.add(l.entityType);
    });
    return Array.from(set).sort();
  }, [logs]);

  // Top KPIs
  const metrics = useMemo(() => {
    const total = pagination.total || logs.length;
    const securityCount = logs.filter(
      (l: AuditLog) =>
        l.action?.includes("ROLE") ||
        l.action?.includes("USER") ||
        l.action?.includes("DELETE") ||
        l.action?.includes("DROP")
    ).length;
    const correctionsCount = logs.filter((l: AuditLog) =>
      l.action?.includes("CORRECT") || l.action?.includes("MANUAL")
    ).length;
    const uniqueActors = new Set(logs.map((l: AuditLog) => l.userEmail)).size;

    return { total, securityCount, correctionsCount, uniqueActors };
  }, [logs, pagination.total]);

  const handleReset = () => {
    setSearch("");
    setActionFilter("");
    setEntityFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Immutable Audit Trail Explorer
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Permanent forensic ledger of all administrative events, state
            mutations, application approvals, role reassignments, and attendance
            corrections.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh Ledger
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Audit Events"
          value={metrics.total}
          subtitle="Permanently recorded events"
          icon={History}
          color="primary"
        />
        <MetricCard
          title="Security & Role Changes"
          value={metrics.securityCount}
          subtitle="Permissions & user modifications"
          icon={ShieldCheck}
          color="blue"
        />
        <MetricCard
          title="Manual Corrections"
          value={metrics.correctionsCount}
          subtitle="Attendance & applicant overrides"
          icon={FileCheck2}
          color="purple"
        />
        <MetricCard
          title="Active System Actors"
          value={metrics.uniqueActors}
          subtitle="Unique administrators logged"
          icon={Users}
          color="primary"
        />
      </div>

      {/* Filters Toolbar */}
      <AuditFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actionFilter={actionFilter}
        onActionFilterChange={(val) => {
          setActionFilter(val);
          setPage(1);
        }}
        entityFilter={entityFilter}
        onEntityFilterChange={(val) => {
          setEntityFilter(val);
          setPage(1);
        }}
        onReset={handleReset}
        actionOptions={actionOptions}
        entityOptions={entityOptions}
      />

      {/* Audit Table */}
      <AuditTable
        logs={logs}
        isLoading={isLoading}
        onInspect={(log) => setSelectedLog(log)}
        page={pagination.page || page}
        totalPages={pagination.totalPages || 1}
        total={pagination.total || 0}
        limit={pagination.limit || ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

      {/* State Mutation Diff Inspector Modal */}
      <AuditStateDiffModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
