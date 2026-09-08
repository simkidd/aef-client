"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrainingEmptyState() {
  const router = useRouter();

  return (
    <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 space-y-4 max-w-lg mx-auto">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary dark:bg-emerald-950/60 dark:text-emerald-400">
        <GraduationCap className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
          No Active Training Enrollment
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          You are not currently admitted into an active training cohort. Once your application is reviewed and accepted, your live schedule and biometric attendance will display here.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Button
          size="sm"
          onClick={() => router.push("/portal/programs")}
          className="text-xs font-semibold gap-1.5"
        >
          Browse Programs
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/portal/applications")}
          className="text-xs"
        >
          Check My Applications
        </Button>
      </div>
    </div>
  );
}
