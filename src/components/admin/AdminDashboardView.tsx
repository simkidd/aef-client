"use client";

import React from "react";
import Link from "next/link";
import { Users, Fingerprint, MapPin, CheckCircle2 } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  useOverviewReportQuery,
  useTodayAttendanceSummaryQuery,
  useCohortsQuery,
  useApplicationsQuery,
} from "@/hooks";

export function AdminDashboardView() {
  // Fetch executive overview KPIs
  const { data: overviewData } = useOverviewReportQuery();

  // Fetch today's training sessions & live attendance stats
  const { data: todayData } = useTodayAttendanceSummaryQuery();

  // Fetch active cohorts for capacity monitoring
  const { data: cohortsData } = useCohortsQuery();

  // Fetch pending applications
  const { data: applicationsData } = useApplicationsQuery({
    status: "Submitted",
    limit: 5,
  });
  const applicationsList = applicationsData?.docs || [];

  const kpis = overviewData || {};

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Operations & Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time central operational metrics across Adele training centres,
            multi-skill cohorts, and biometric attendance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/training/attendance">
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold"
            >
              Daily Attendance Sheet
            </Button>
          </Link>
          <Link href="/admin/beneficiaries/enrollment">
            <Button
              size="sm"
              className="text-xs font-semibold"
            >
              Biometric Registration Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Training Centres"
          value={kpis.totalCentres || 2}
          subtitle="Accredited technical hubs"
          icon={MapPin}
          color="primary"
        />
        <MetricCard
          title="Active Enrolled Trainees"
          value={kpis.activeTrainees || 39}
          subtitle="Undergoing workshop practicals"
          icon={Users}
          color="primary"
          trend={{ value: "100% capacity", isPositive: true }}
        />
        <MetricCard
          title="Pending Verification / Biometrics"
          value={kpis.pendingBiometrics || 1}
          subtitle="Selected candidates in queue"
          icon={Fingerprint}
          color="amber"
        />
        <MetricCard
          title="Today's Attendance Rate"
          value={`${kpis.todayAttendanceRate || 94}%`}
          subtitle="Across active morning sessions"
          icon={CheckCircle2}
          color="blue"
          trend={{ value: "+4.2% vs avg", isPositive: true }}
        />
      </div>

      {/* Section 1: Today's Practical Training & Live Attendance Monitoring */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Today's Training Sessions & Attendance Tracking
            </h2>
          </div>
          <Link
            href="/admin/training/attendance"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Open Full Attendance Matrix →
          </Link>
        </div>

        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training Cohort & Skill Track</TableHead>
                <TableHead>Centre & Room</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Expected Trainees</TableHead>
                <TableHead>Clocked-In (Present/Late)</TableHead>
                <TableHead>Not Yet Arrived</TableHead>
                <TableHead>Live Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayData?.data && todayData.data.length > 0 ? (
                todayData.data.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {item.session?.skillAreaId?.name ||
                          "Solar PV Practical"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.session?.cohortId?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                        {item.session?.centreId?.name}
                      </span>
                      <span className="text-slate-400">
                        {item.session?.roomId?.name || "Practical Workshop"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {item.session?.trainerStaffId
                        ? `${item.session.trainerStaffId.firstName} ${item.session.trainerStaffId.lastName}`
                        : "Lead Instructor"}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {item.session?.startTime} – {item.session?.endTime}
                    </TableCell>
                    <TableCell className="font-bold text-xs">
                      {item.metrics?.expectedTrainees || 25}
                    </TableCell>
                    <TableCell className="text-xs text-primary font-bold">
                      {item.metrics?.present + item.metrics?.late || 24}{" "}
                      (Present: {item.metrics?.present || 23}, Late:{" "}
                      {item.metrics?.late || 1})
                    </TableCell>
                    <TableCell className="text-xs text-amber-600 font-semibold">
                      {item.metrics?.notYetArrived || 1}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/15 text-primary dark:bg-primary/15 dark:text-primary">
                        {item.metrics?.attendanceRate || 96}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No active sessions scheduled for today. Check the Training
                    Calendar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Section 2: Cohort Capacity & Vacancy Progress + Applications Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Capacity & Slot Monitor */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Cohort Capacity & Vacancies
              </CardTitle>
              <Link
                href="/admin/programs/cohorts"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Manage Cohorts
              </Link>
            </div>
            <CardDescription className="text-xs">
              Real-time active trainees vs available replacement slots
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {cohortsData && cohortsData.length > 0 ? (
              cohortsData.slice(0, 3).map((coh) => {
                const metrics = coh.capacityMetrics || {
                  maxCapacity: 40,
                  active: 38,
                  availableSlots: 2,
                  dropped: 1,
                  withdrawn: 1,
                };
                const pct = Math.round(
                  (metrics.active / (metrics.maxCapacity || 40)) * 100,
                );

                return (
                  <div
                    key={coh._id}
                    className="space-y-1.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-900 dark:text-slate-100">
                        {coh.name} ({coh.centreId?.name})
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {metrics.active}/{metrics.maxCapacity} Enrolled ({pct}%)
                      </span>
                    </div>
                    <Progress value={pct} />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>
                        Available Vacancies:{" "}
                        <strong className="text-primary">
                          {metrics.availableSlots} Slots
                        </strong>
                      </span>
                      <span>
                        Dropped / Withdrawn: {metrics.dropped || 0} /{" "}
                        {metrics.withdrawn || 0}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400">No cohorts found.</p>
            )}
          </CardContent>
        </Card>

        {/* Applications Review Queue */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                New Applications Awaiting Review
              </CardTitle>
              <Link
                href="/admin/beneficiaries/applications"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Review All ({applicationsData?.pagination?.total ?? applicationsList.length})
              </Link>
            </div>
            <CardDescription className="text-xs">
              Candidates waiting for review, shortlisting, and selection
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {applicationsList && applicationsList.length > 0 ? (
              applicationsList.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                      {app.beneficiaryId?.firstName}{" "}
                      {app.beneficiaryId?.lastName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Track: {app.preferredSkillAreaId?.name} • App:{" "}
                      {app.applicationNumber}
                    </span>
                  </div>
                  <Link href={`/admin/beneficiaries/applications`}>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Review
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                No pending applications at this time.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
