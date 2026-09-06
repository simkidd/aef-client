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
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { AttendanceRecord } from "@/interfaces";
import {
  Clock,
  User,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  History,
  Fingerprint,
  Building,
  Layers,
  BookOpen,
  Edit3,
} from "lucide-react";

interface AttendanceDetailsSheetProps {
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCorrection?: (record: AttendanceRecord) => void;
}

export function AttendanceDetailsSheet({
  record,
  isOpen,
  onClose,
  onOpenCorrection,
}: AttendanceDetailsSheetProps) {
  if (!record) return null;

  const benName =
    typeof record.beneficiaryId === "object"
      ? `${record.beneficiaryId?.firstName || ""} ${record.beneficiaryId?.lastName || ""}`.trim() ||
        record.beneficiaryId?.fullName ||
        "Trainee Record"
      : "Trainee Record";

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
            <SheetHeader className="p-0 text-left border-b pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                  Log #{record._id?.slice(0, 8)}
                </span>
                <StatusBadge status={record.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {benName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {record.cohortId?.name || "Active Cohort"} •{" "}
                {formatDate(record.date)}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  First Clock In
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {record.firstClockIn
                      ? formatDate(record.firstClockIn, true)
                      : "No Scan"}
                  </span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Last Clock Out
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {record.lastClockOut
                      ? formatDate(record.lastClockOut, true)
                      : "No Scan"}
                  </span>
                </span>
              </div>
            </div>

            {/* Trainee Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Trainee & Academic Information
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Beneficiary ID
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {record.beneficiaryId?.beneficiaryCode ||
                      record.beneficiaryId?._id?.slice(0, 10) ||
                      "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Cohort
                  </span>
                  <span className="font-medium text-foreground">
                    {record.cohortId?.name || "Cohort Alpha"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" /> Skill Track
                  </span>
                  <span className="font-medium text-foreground">
                    {record.skillAreaId?.name || "Technical Track"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building className="h-3.5 w-3.5" /> Training Centre
                  </span>
                  <span className="font-medium text-foreground">
                    {record.centreId?.name || "Main Hub Facility"}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration and Lateness */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Time Audit & Compliance
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground">Session Duration</span>
                  <span className="font-semibold text-foreground">
                    {record.durationMinutes || 0} minutes
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground">Lateness Calculation</span>
                  <span
                    className={
                      record.isLate
                        ? "font-semibold text-amber-500"
                        : "font-semibold text-emerald-500"
                    }
                  >
                    {record.isLate
                      ? `Late (${record.minutesLate || 0} mins)`
                      : "On-Time Arrival"}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Correction Audit Banner */}
            {record.isManualCorrection && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Audit Trail & Overrides
                </h4>
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Manual Administrator Correction</span>
                  </div>
                  <p className="text-foreground">
                    Reason: {record.correctionReason || record.notes || "Not specified"}
                  </p>
                  {record.originalStatus && (
                    <p className="text-[11px] text-muted-foreground">
                      Original Status Prior to Override: {record.originalStatus}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Correction Action Card */}
            {onOpenCorrection && (
              <div className="rounded-lg border p-3.5 bg-card space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Administrative Override</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Audited action
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onOpenCorrection(record);
                  }}
                  className="w-full text-xs font-semibold gap-2 mt-1 border-border"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Request Status Correction
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40">
          <Button variant="outline" onClick={onClose} className="w-full text-xs">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
