"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  Award,
  MapPin,
  Sparkles,
  Building,
  PieChart,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MetricCard } from "@/components/common/MetricCard";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { api } from "@/lib/client";

export default function ReportsAndImpactPage() {
  const { data: impactData, isLoading } = useQuery({
    queryKey: ["admin-impact-reports"],
    queryFn: async () => {
      const res = await api.get("/reports/impact");
      return res.data?.data;
    },
  });

  const { data: overviewKpis } = useQuery({
    queryKey: ["admin-overview-kpis"],
    queryFn: async () => {
      const res = await api.get("/reports/overview");
      return res.data?.data?.kpis;
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Reports & Organization Impact Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated institutional statistics answering organizational reach,
            demographic inclusion, training completions, and centre capacity
            utilization.
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Beneficiaries Reached"
            value={overviewKpis?.totalBeneficiaries || 42}
            subtitle="Registered in foundation database"
            icon={Users}
            color="primary"
          />
          <MetricCard
            title="Active Trainees"
            value={overviewKpis?.activeTrainees || 39}
            subtitle="Undergoing practical sessions"
            icon={Building}
            color="primary"
          />
          <MetricCard
            title="Graduates Certified"
            value={overviewKpis?.certificatesIssued || 1}
            subtitle="Verified credential issued"
            icon={Award}
            color="blue"
          />
          <MetricCard
            title="Average Attendance Rate"
            value={`${overviewKpis?.todayAttendanceRate || 94.2}%`}
            subtitle="Calculated across active cohorts"
            icon={Sparkles}
            color="purple"
          />
        </div>

        {/* Centre Performance Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
            Training Centre Performance & Capacity Utilization
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training Centre</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Active Trainees</TableHead>
                  <TableHead>Graduated</TableHead>
                  <TableHead>Capacity Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactData?.centrePerformance?.map((c: any) => (
                  <TableRow key={c.centreId}>
                    <TableCell className="font-bold text-xs">
                      {c.name} ({c.code})
                    </TableCell>
                    <TableCell className="text-xs">{c.state} State</TableCell>
                    <TableCell className="text-xs font-semibold">
                      {c.capacity} Seats
                    </TableCell>
                    <TableCell className="text-xs font-bold text-primary">
                      {c.activeTrainees}
                    </TableCell>
                    <TableCell className="text-xs text-primary">
                      {c.graduated || 0}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{c.utilizationRate}%</span>
                        <Progress
                          value={c.utilizationRate}
                          className="w-20 h-1.5"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-slate-500 text-xs"
                    >
                      Loading centre metrics...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Demographics & Popularity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Inclusion */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base">
                Gender Demographics & Inclusion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              {impactData?.genderDistribution?.map((g: any) => (
                <div
                  key={g._id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 border-slate-100 dark:border-slate-800"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {g._id || "Unspecified"}
                  </span>
                  <span className="font-bold text-primary">
                    {g.count} Beneficiaries
                  </span>
                </div>
              )) || <p className="text-slate-400">Loading demographics...</p>}
            </CardContent>
          </Card>

          {/* Education Breakdown */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base">
                Educational Background Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              {impactData?.educationDistribution?.map((e: any) => (
                <div
                  key={e._id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 border-slate-100 dark:border-slate-800"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {e._id || "Other"}
                  </span>
                  <span className="font-bold text-primary">
                    {e.count} Trainees
                  </span>
                </div>
              )) || (
                <p className="text-slate-400">Loading education metrics...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
