"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Users,
  Edit2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  DoorOpen,
  Briefcase,
} from "lucide-react";
import { Cohort } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { useCohortQuery } from "@/hooks";

interface CohortDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cohort: Cohort | null;
  onOpenEdit?: (cohort: Cohort) => void;
}

export function CohortDetailsSheet({
  isOpen,
  onClose,
  cohort,
  onOpenEdit,
}: CohortDetailsSheetProps) {
  const { data: detailData } = useCohortQuery(cohort?._id || "");

  if (!cohort) return null;

  const fullCohort = (detailData as any)?.cohort || detailData || cohort;
  const enrollments = (detailData as any)?.enrollments || [];

  const metrics = fullCohort.capacityMetrics || {
    maxCapacity: fullCohort.maxCapacity || 40,
    active: enrollments.length || 0,
    availableSlots: Math.max(
      0,
      (fullCohort.maxCapacity || 40) - (enrollments.length || 0)
    ),
    dropped: 0,
    withdrawn: 0,
  };

  const pct = Math.min(
    100,
    Math.round(((metrics.active || 0) / (fullCohort.maxCapacity || 1)) * 100)
  );

  return (
    <Sheet
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          onClose();
        }
      }}
    >
      <SheetContent
        className="w-full! sm:max-w-lg! p-0 flex flex-col justify-between overflow-hidden gap-0"
        showCloseButton={false}
      >
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="p-0 text-left border-b border-border pb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                  {fullCohort.cohortCode}
                </span>
                <StatusBadge status={fullCohort.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground">
                {fullCohort.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  {fullCohort.centreId?.name || "Training Facility"}
                </span>
                <span>•</span>
                <span>
                  Program: {fullCohort.programId?.title || "Vocational Track"}
                </span>
              </SheetDescription>
            </SheetHeader>

            {/* Capacity Slot Metrics */}
            <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-teal-600" />
                  Cohort Capacity Allocation
                </span>
                <span className="text-foreground">
                  {metrics.active} / {fullCohort.maxCapacity} Seats ({pct}%)
                </span>
              </div>
              <Progress value={pct} className="h-2.5" />
              <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground block">
                    Active Trainees
                  </span>
                  <span className="font-bold text-foreground">
                    {metrics.active}
                  </span>
                </div>
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground block">
                    Available Slots
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {metrics.availableSlots}
                  </span>
                </div>
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground block">
                    Dropped / Withdrawn
                  </span>
                  <span className="font-bold text-foreground">
                    {(metrics.dropped || 0) + (metrics.withdrawn || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timetable Schedule & Disciplines */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                Timetable & Practical Sessions
              </h4>
              <div className="space-y-2">
                {fullCohort.skillConfigs &&
                fullCohort.skillConfigs.length > 0 ? (
                  fullCohort.skillConfigs.map((cfg: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border bg-card space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          {cfg.skillAreaId?.name ||
                            cfg.skillName ||
                            "Discipline Track"}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                          {cfg.startTime || "09:00"} – {cfg.endTime || "12:00"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DoorOpen className="h-3 w-3" />
                          {cfg.assignedRoomId?.name || "Practical Lab"}
                        </span>
                        <span>{cfg.durationWeeks || 8} Weeks Duration</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No timetable schedule configured.
                  </p>
                )}
              </div>
            </div>

            {/* Timeline info */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-600" />
                Cohort Period
              </h4>
              <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Commencement Date
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatDate(fullCohort.startDate)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Completion Date
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatDate(fullCohort.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrolled Trainees */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-teal-600" />
                  Enrolled Beneficiaries ({enrollments.length})
                </h4>
              </div>

              {enrollments.length > 0 ? (
                <div className="space-y-2">
                  {enrollments.map((enr: any) => (
                    <div
                      key={enr._id}
                      className="p-3 rounded-lg border border-border bg-card flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground block">
                          {enr.beneficiaryId?.firstName}{" "}
                          {enr.beneficiaryId?.lastName}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Reg: {enr.beneficiaryId?.registrationNumber || "N/A"}
                        </span>
                      </div>
                      <StatusBadge status={enr.status} size="sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center rounded-lg border border-dashed border-border bg-muted/10 text-muted-foreground text-xs">
                  No trainees currently enrolled in this cohort batch.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <SheetFooter className="p-4 border-t border-border bg-muted/40 flex flex-row gap-2 mt-auto">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            Close
          </Button>
          {onOpenEdit && (
            <Button
              onClick={() => {
                onClose();
                onOpenEdit(fullCohort);
              }}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Cohort
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
