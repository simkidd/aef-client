"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

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

interface MonthlyStats {
  total: number;
  present: number;
  late: number;
  excused: number;
  absent: number;
  rate: number;
}

interface MonthlyAttendanceTableProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedMonthLabel: string;
  monthlyStats: MonthlyStats;
  filteredRecords: any[];
}

export function MonthlyAttendanceTable({
  selectedYear,
  onYearChange,
  availableYears,
  selectedMonth,
  onMonthChange,
  selectedMonthLabel,
  monthlyStats,
  filteredRecords,
}: MonthlyAttendanceTableProps) {
  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
            Monthly Attendance Records
          </h3>
          <p className="text-xs text-slate-500">
            Select year and month to review your periodic attendance report.
          </p>
        </div>

        {/* Year & Month Filters */}
        <div className="flex items-center gap-2">
          {/* Year Select */}
          <div className="w-28">
            <Select
              value={selectedYear}
              onValueChange={(val) => onYearChange(val || "all")}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((yr) => (
                  <SelectItem key={yr} value={yr}>
                    {yr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Select */}
          <div className="w-36">
            <Select
              value={selectedMonth}
              onValueChange={(val) => onMonthChange(val || "all")}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {MONTH_NAMES.map((mName) => (
                  <SelectItem key={mName} value={mName}>
                    {mName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Selected Month Performance Summary Strip */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/15">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {selectedMonthLabel} {selectedYear !== "all" ? selectedYear : ""} Report
            </h4>
            <p className="text-[11px] text-slate-500">
              {monthlyStats.total > 0
                ? `${monthlyStats.present + monthlyStats.late + monthlyStats.excused} of ${monthlyStats.total} sessions attended (${monthlyStats.rate}% monthly rate)`
                : "No sessions recorded for this month"}
            </p>
          </div>
        </div>

        {monthlyStats.total > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              Present: <strong>{monthlyStats.present}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              Late: <strong>{monthlyStats.late}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              Absent: <strong>{monthlyStats.absent}</strong>
            </span>
            <span
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                monthlyStats.rate >= 80
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              }`}
            >
              {monthlyStats.rate}% Rate
            </span>
          </div>
        )}
      </div>

      {/* Monthly Table with Class Start Time, Clock In Time, Clock Out Time */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50">
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-xs font-bold">Session / Track</TableHead>
              <TableHead className="text-xs font-bold">Class Start Time</TableHead>
              <TableHead className="text-xs font-bold">Clock-In Time</TableHead>
              <TableHead className="text-xs font-bold">Clock-Out Time</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec: any) => {
                const firstIn = rec.firstClockIn
                  ? formatDate(rec.firstClockIn, true).split(",")[1]?.trim()
                  : "—";
                const lastOut = rec.lastClockOut
                  ? formatDate(rec.lastClockOut, true).split(",")[1]?.trim()
                  : "—";
                const classStartTime =
                  rec.sessionId?.startTime ||
                  rec.cohortId?.skillConfigs?.[0]?.startTime ||
                  "09:00 AM";

                return (
                  <TableRow key={rec._id} className="text-xs">
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatDate(rec.date)}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {rec.sessionId?.topic ||
                        rec.skillAreaId?.name ||
                        "Practical Lab Session"}
                    </TableCell>
                    <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                      {classStartTime}
                    </TableCell>
                    <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                      {firstIn}
                    </TableCell>
                    <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                      {lastOut}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rec.status} size="sm" />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-500 text-xs"
                >
                  No attendance records logged for{" "}
                  <strong>
                    {selectedMonthLabel}{" "}
                    {selectedYear !== "all" ? selectedYear : ""}
                  </strong>
                  .
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
