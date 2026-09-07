"use client";

import React from "react";
import {
  useOverviewReportQuery,
  useImpactReportQuery,
} from "@/hooks/queries/useReportQueries";
import { ExecutiveKpiGrid } from "./ExecutiveKpiGrid";
import { CentrePerformanceTable } from "./CentrePerformanceTable";
import { DemographicsChartCard } from "./DemographicsChartCard";
import {
  BarChart3,
  Download,
  RefreshCw,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ReportsAndImpactView() {
  const {
    data: overviewKpis,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useOverviewReportQuery();

  const {
    data: impactData,
    isLoading: isImpactLoading,
    refetch: refetchImpact,
    isFetching: isFetchingImpact,
  } = useImpactReportQuery();

  const isFetching = isFetchingOverview || isFetchingImpact;

  const handleRefresh = () => {
    refetchOverview();
    refetchImpact();
  };

  const handleExportSummary = () => {
    try {
      const summary = {
        exportedAt: new Date().toISOString(),
        kpis: overviewKpis,
        centrePerformance: impactData?.centrePerformance,
        genderDistribution: impactData?.genderDistribution,
        educationDistribution: impactData?.educationDistribution,
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(summary, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `AEF_Impact_Report_${new Date().toISOString().slice(0, 10)}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.add({
        title: "Report Exported",
        description: "Impact report summary JSON exported successfully.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Export Failed",
        description: "Failed to export impact report summary.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Reports & Institutional Impact
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Aggregated institutional statistics tracking demographic reach,
            female technical inclusion, training completions, and physical
            centre capacity.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="text-xs whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleExportSummary}
            className="text-xs whitespace-nowrap font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Export Impact Report
          </Button>
        </div>
      </div>

      {/* Executive KPIs */}
      <ExecutiveKpiGrid
        overviewKpis={overviewKpis}
        isLoading={isOverviewLoading}
      />

      {/* Centre Performance Table */}
      <CentrePerformanceTable
        data={impactData?.centrePerformance}
        isLoading={isImpactLoading}
      />

      {/* Demographics and Inclusion */}
      <DemographicsChartCard
        genderData={impactData?.genderDistribution}
        educationData={impactData?.educationDistribution}
        isLoading={isImpactLoading}
      />
    </div>
  );
}
