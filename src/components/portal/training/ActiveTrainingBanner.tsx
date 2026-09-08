"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { Enrollment } from "@/interfaces";

interface ActiveTrainingBannerProps {
  active: Enrollment;
}

export function ActiveTrainingBanner({ active }: ActiveTrainingBannerProps) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-7 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <GraduationCap className="h-3.5 w-3.5" />
              Enrolled Active Track
            </span>
            <span className="font-mono text-xs text-emerald-200/70">
              {active.enrollmentCode}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
            {active.skillAreaId?.name || "Vocational Empowerment Track"}
          </h2>
          <p className="text-xs text-emerald-100/80">
            Program: <strong>{active.programId?.title}</strong> • Cohort:{" "}
            <strong>{active.cohortId?.name}</strong>
          </p>
        </div>

        <div className="sm:text-right bg-white/10 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-200/80 block">
            Training Centre
          </span>
          <p className="text-sm font-bold text-white mt-0.5">
            {active.centreId?.name}
          </p>
          <p className="text-[11px] text-emerald-200/70 mt-0.5">
            {active.centreId?.address || active.centreId?.state}
          </p>
        </div>
      </div>
    </div>
  );
}
