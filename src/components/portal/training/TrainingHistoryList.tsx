"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Enrollment } from "@/interfaces";

interface TrainingHistoryListProps {
  history: Enrollment[];
}

export function TrainingHistoryList({ history }: TrainingHistoryListProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
          Completed Trainings & Historical Records
        </h3>
        <Link
          href="/portal/certificates"
          className="text-xs text-primary font-semibold hover:underline"
        >
          View Issued Certificates &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {history.map((enr) => (
          <Card
            key={enr._id}
            className="p-4 border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="space-y-1 min-w-0">
              <span className="font-mono text-[10px] text-slate-400 block">
                {enr.enrollmentCode}
              </span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                {enr.skillAreaId?.name || "Vocational Track"}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {enr.programId?.title} • {enr.centreId?.name}
              </p>
            </div>
            <StatusBadge status={enr.status} size="sm" />
          </Card>
        ))}
      </div>
    </div>
  );
}
