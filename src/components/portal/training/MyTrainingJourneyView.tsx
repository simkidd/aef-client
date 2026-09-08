"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useMyTrainingJourneyQuery, useMyAttendanceQuery } from "@/hooks";
import { ActiveTrainingBanner } from "./ActiveTrainingBanner";
import { TrainingKpiCards } from "./TrainingKpiCards";
import { AttendanceCharts } from "./AttendanceCharts";
import { MonthlyAttendanceTable } from "./MonthlyAttendanceTable";
import { TrainingEmptyState } from "./TrainingEmptyState";
import { TrainingHistoryList } from "./TrainingHistoryList";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MyTrainingJourneyView() {
  const { data: trainingData, isLoading: trainLoading } =
    useMyTrainingJourneyQuery();
  const { data: attendanceData, isLoading: attLoading } = useMyAttendanceQuery();

  const active = trainingData?.active;
  const history = trainingData?.history || [];

  // Parse attendance response
  const stats = (attendanceData as any)?.stats || {
    totalSessions: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    attendanceRate: active?.overallAttendanceRate ?? 0,
  };

  const records = useMemo(() => {
    return (
      (attendanceData as any)?.records ??
      (attendanceData as any)?.data ??
      []
    );
  }, [attendanceData]);

  // Overall attendance rate
  const attendanceRate = stats.attendanceRate ?? active?.overallAttendanceRate ?? 0;
  const isEligibleForCert = attendanceRate >= 80;

  // Identify latest month/year from records, or fallback to current date
  const latestDate = useMemo(() => {
    if (records.length > 0 && records[0].date) {
      return new Date(records[0].date);
    }
    return new Date();
  }, [records]);

  // Monthly filter states (default to latest month uploaded by name)
  const [selectedYear, setSelectedYear] = useState<string>(() =>
    latestDate.getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    MONTH_NAMES[latestDate.getMonth()]
  );

  // Sync state if records load asynchronously after initial mount
  useEffect(() => {
    if (records.length > 0 && records[0].date) {
      const d = new Date(records[0].date);
      setSelectedYear(d.getFullYear().toString());
      setSelectedMonth(MONTH_NAMES[d.getMonth()]);
    }
  }, [records]);

  // Extract unique available years from records
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    const currentYear = new Date().getFullYear().toString();
    years.add(currentYear);
    records.forEach((r: any) => {
      if (r.date) {
        years.add(new Date(r.date).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [records]);

  // Filter records by selected Month and Year, sorted chronologically (ascending: Day 1 -> Day 31)
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec: any) => {
        if (!rec.date) return false;
        const d = new Date(rec.date);
        const yearMatch =
          selectedYear === "all" || d.getFullYear().toString() === selectedYear;
        const recMonthName = MONTH_NAMES[d.getMonth()];
        const monthMatch =
          selectedMonth === "all" || recMonthName === selectedMonth;
        return yearMatch && monthMatch;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [records, selectedYear, selectedMonth]);

  // Compute stats for selected Month
  const monthlyStats = useMemo(() => {
    const total = filteredRecords.length;
    const present = filteredRecords.filter((r: any) => r.status === "PRESENT").length;
    const late = filteredRecords.filter((r: any) => r.status === "LATE").length;
    const excused = filteredRecords.filter((r: any) => r.status === "EXCUSED").length;
    const absent = filteredRecords.filter((r: any) => r.status === "ABSENT").length;
    const rate =
      total > 0
        ? Math.round(((present + late + excused) / total) * 100 * 10) / 10
        : 0;

    return {
      total,
      present,
      late,
      excused,
      absent,
      rate,
    };
  }, [filteredRecords]);

  // Chart data: Distribution breakdown for the overall attendance
  const distributionData = useMemo(() => {
    return [
      { name: "On Time", count: stats.present || 0, color: "#10b981" },
      { name: "Late", count: stats.late || 0, color: "#f59e0b" },
      { name: "Excused", count: stats.excused || 0, color: "#3b82f6" },
      { name: "Absent", count: stats.absent || 0, color: "#ef4444" },
    ].filter((item) => item.count > 0 || stats.totalSessions === 0);
  }, [stats]);

  if (trainLoading || attLoading) {
    return (
      <div className="p-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
        <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wider">
          Loading training journey & attendance...
        </p>
      </div>
    );
  }

  const selectedMonthLabel =
    selectedMonth === "all" ? "All Months" : selectedMonth;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          Live Training & Attendance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your ongoing workshop enrollments, biometric clock-in history, and monthly compliance records.
        </p>
      </div>

      {active ? (
        <>
          {/* Active Training Hero Banner */}
          <ActiveTrainingBanner active={active} />

          {/* Overall Attendance KPI Cards */}
          <TrainingKpiCards
            active={active}
            stats={stats}
            attendanceRate={attendanceRate}
            isEligibleForCert={isEligibleForCert}
            totalRecordsCount={records.length}
          />

          {/* Attendance Chart & Distribution */}
          {records.length > 0 && (
            <AttendanceCharts
              distributionData={distributionData}
              stats={stats}
              records={records}
            />
          )}

          {/* Monthly Attendance Records Section */}
          <MonthlyAttendanceTable
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            availableYears={availableYears}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedMonthLabel={selectedMonthLabel}
            monthlyStats={monthlyStats}
            filteredRecords={filteredRecords}
          />
        </>
      ) : (
        /* Empty State when no active training */
        <TrainingEmptyState />
      )}

      {/* Lifelong Training History (Past Completed Programs) */}
      <TrainingHistoryList history={history} />
    </div>
  );
}
