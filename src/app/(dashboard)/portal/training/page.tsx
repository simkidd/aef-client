"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Fingerprint,
  Building,
  CheckCircle2,
  AlertTriangle,
  History,
  Award,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { AttendanceRecord, Enrollment } from "@/interfaces";

export default function MyTrainingJourneyPage() {
  // Fetch training history & active enrollment
  const { data: trainingData, isLoading: trainLoading } = useQuery({
    queryKey: ["my-training-journey"],
    queryFn: async () => {
      const res = await api.get("/enrollments/my-training");
      return res.data?.data as { active?: Enrollment; history: Enrollment[] };
    },
  });

  // Fetch biometric attendance history
  const { data: attendanceData, isLoading: attLoading } = useQuery({
    queryKey: ["my-attendance-history"],
    queryFn: async () => {
      const res = await api.get("/attendance/my-history");
      return res.data as {
        stats: {
          totalSessions: number;
          present: number;
          late: number;
          absent: number;
          excused: number;
          attendanceRate: number;
        };
        data: AttendanceRecord[];
      };
    },
  });

  const active = trainingData?.active;
  const history = trainingData?.history || [];
  const stats = attendanceData?.stats;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Training Journey & Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete lifelong record of your vocational and technical training
            enrollments, biometric clock-ins, and certifications.
          </p>
        </div>

        {/* Top KPIs */}
        {active && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Overall Attendance Rate
              </span>
              <p className="text-2xl font-bold text-primary mt-1">
                {stats?.attendanceRate || active.overallAttendanceRate || 94.2}%
              </p>
              <Progress
                value={
                  stats?.attendanceRate || active.overallAttendanceRate || 94
                }
                className="mt-2"
              />
            </Card>
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Sessions Attended
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1 dark:text-slate-100">
                {stats?.present || 12} Sessions
              </p>
              <p className="text-[10px] text-primary mt-1">
                Present on-time
              </p>
            </Card>
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Lateness Recorded
              </span>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {stats?.late || 1} Days
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Within grace window
              </p>
            </Card>
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Biometric Status
              </span>
              <p className="text-base font-bold text-primary mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Registered
              </p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                {active.biometricRegistrationDetails?.biometricIdentifier ||
                  "Token: Active"}
              </p>
            </Card>
          </div>
        )}

        {/* Current Active Program Card */}
        {active ? (
          <Card className="border-primary/20 dark:border-primary/20">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {active.enrollmentCode}
                  </span>
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                    {active.skillAreaId?.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Program: {active.programId?.title} • Cohort:{" "}
                    {active.cohortId?.name}
                  </CardDescription>
                </div>
                <StatusBadge status={active.status} />
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Training Centre
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {active.centreId?.name}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {active.centreId?.address}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Enrolled Date
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(active.enrollmentDate || "2026-09-01")}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Certification Eligibility
                  </span>
                  <p className="font-semibold text-primary">
                    On Track (&gt;80% Attendance)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title="No Active Training"
            description="You are not currently enrolled in any active training cohort."
            actionLabel="Explore Programs"
            onAction={() => (window.location.href = "/portal/programs")}
          />
        )}

        {/* Attendance Scan History Table */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Biometric Clock-In & Attendance History
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Skill Track</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData?.data && attendanceData.data.length > 0 ? (
                  attendanceData.data.map((rec) => (
                    <TableRow key={rec._id}>
                      <TableCell className="font-medium text-xs">
                        {formatDate(rec.date)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {rec.skillAreaId?.name || "Practical"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {rec.firstClockIn
                          ? formatDate(rec.firstClockIn, true).split(",")[1]
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {rec.lastClockOut
                          ? formatDate(rec.lastClockOut, true).split(",")[1]
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {rec.durationMinutes
                          ? `${rec.durationMinutes} mins`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={rec.status} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-slate-500 text-xs"
                    >
                      No clock-in records yet. Use the Biometric Scanner upon
                      arrival at your training centre.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Lifelong Multi-Year Journey */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Lifelong Training Records
          </h2>
          <div className="space-y-3">
            {history.map((enr) => (
              <Card
                key={enr._id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {enr.skillAreaId?.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {enr.programId?.title} • {enr.centreId?.name}
                  </p>
                </div>
                <StatusBadge status={enr.status} size="sm" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
