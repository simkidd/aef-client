"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Enrollment } from "@/interfaces";

interface AttendanceStats {
  totalSessions: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  attendanceRate: number;
}

interface TrainingKpiCardsProps {
  active: Enrollment;
  stats: AttendanceStats;
  attendanceRate: number;
  isEligibleForCert: boolean;
  totalRecordsCount: number;
}

export function TrainingKpiCards({
  active,
  stats,
  attendanceRate,
  isEligibleForCert,
  totalRecordsCount,
}: TrainingKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Cumulative Rate */}
      <Card className="p-4 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Cumulative Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary">
              {attendanceRate}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              (Min 80% req.)
            </span>
          </div>
          <Progress value={attendanceRate} className="mt-2.5 h-2" />
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-primary" />
          <span>Computed from biometric clock-ins</span>
        </div>
      </Card>

      {/* Sessions Attended */}
      <Card className="p-4 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Sessions
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.present + stats.late + stats.excused}
            </span>
            <span className="text-xs text-slate-400">
              / {stats.totalSessions || totalRecordsCount || 0} Total
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {stats.present} on-time • {stats.late} late
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
          <span>{stats.absent} recorded absences</span>
        </div>
      </Card>

      {/* Biometric Status */}
      <Card className="p-4 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Biometric Terminal
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <Fingerprint className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Active & Enrolled
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Clock in upon arrival at center
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 truncate">
          ID: {active.biometricRegistrationDetails?.biometricIdentifier || active.enrollmentCode}
        </div>
      </Card>

      {/* Certification Eligibility */}
      <Card className="p-4 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Certification Status
          </span>
          <div className="mt-2">
            {isEligibleForCert ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                On Track for Award
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Below 80% Threshold
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isEligibleForCert
              ? "Eligible for certificate upon cohort graduation"
              : "Attend upcoming sessions to raise your rate"}
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
          <Link
            href="/portal/certificates"
            className="hover:text-primary transition-colors inline-flex items-center gap-1 font-semibold"
          >
            View Certificates &rarr;
          </Link>
        </div>
      </Card>
    </div>
  );
}
