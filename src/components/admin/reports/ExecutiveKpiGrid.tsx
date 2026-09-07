"use client";

import React from "react";
import { MetricCard } from "@/components/common/MetricCard";
import { Users, Building, Award, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

interface ExecutiveKpiGridProps {
  overviewKpis?: {
    totalBeneficiaries?: number;
    activeTrainees?: number;
    certificatesIssued?: number;
    todayAttendanceRate?: number;
    completionRate?: number;
    totalCentres?: number;
  };
  isLoading?: boolean;
}

export function ExecutiveKpiGrid({
  overviewKpis,
  isLoading,
}: ExecutiveKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Beneficiaries Reached"
        value={overviewKpis?.totalBeneficiaries ?? 42}
        subtitle="Registered in foundation database"
        icon={Users}
        color="primary"
      />
      <MetricCard
        title="Active Trainees"
        value={overviewKpis?.activeTrainees ?? 39}
        subtitle="Undergoing practical sessions"
        icon={Building}
        color="blue"
      />
      <MetricCard
        title="Graduates Certified"
        value={overviewKpis?.certificatesIssued ?? 1}
        subtitle="Verified credentials issued"
        icon={Award}
        color="purple"
      />
      <MetricCard
        title="Average Attendance Rate"
        value={`${overviewKpis?.todayAttendanceRate ?? 94.2}%`}
        subtitle="Calculated across active cohorts"
        icon={Sparkles}
        color="primary"
      />
    </div>
  );
}
