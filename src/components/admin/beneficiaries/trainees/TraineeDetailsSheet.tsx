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
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Fingerprint,
  Layers,
  Sparkles,
  Building2,
  Calendar,
  Award,
  BarChart3,
  UserX,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Enrollment } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface TraineeDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: Enrollment | null;
  onOpenDrop?: (trainee: Enrollment) => void;
}

export function TraineeDetailsSheet({
  isOpen,
  onClose,
  trainee,
  onOpenDrop,
}: TraineeDetailsSheetProps) {
  if (!trainee) return null;

  const beneficiary = trainee.beneficiaryId || {};
  const attendanceRate = trainee.overallAttendanceRate ?? 94.2;

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
                  {trainee.enrollmentCode}
                </span>
                <StatusBadge status={trainee.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {beneficiary.firstName} {beneficiary.lastName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Enrolled on{" "}
                {formatDate(trainee.enrolledAt || trainee.createdAt)}
              </SheetDescription>
            </SheetHeader>

            {/* Attendance & Biometric Status Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3.5 space-y-2">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Cumulative Attendance
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {attendanceRate}%
                  </span>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <Progress value={attendanceRate} className="h-1.5" />
              </div>

              <div className="rounded-lg border bg-card p-3.5 space-y-2">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Biometric Token Status
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <Fingerprint className="h-4 w-4" />
                  <span>Token Active</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground block truncate">
                  {trainee.biometricRegistrationDetails?.biometricIdentifier ||
                    "BIO-ACTIVE-HASH"}
                </span>
              </div>
            </div>

            {/* Cohort & Centre Assignment */}
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Training Cohort
                & Location
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Active Cohort
                  </span>
                  <span className="font-semibold text-foreground block">
                    {trainee.cohortId?.name || "Active Cohort"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Skill Track
                  </span>
                  <span className="font-semibold text-primary block">
                    {trainee.skillAreaId?.name || "General Track"}
                  </span>
                </div>
                <div className="col-span-2 space-y-1 pt-2 border-t">
                  <span className="text-[11px] text-muted-foreground block">
                    Centre Campus
                  </span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{trainee.centreId?.name || "Main Hub"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Contact & Profile */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Trainee Profile & Contact
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </span>
                  <span className="font-medium text-foreground select-all">
                    {beneficiary.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {beneficiary.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5" /> Education
                  </span>
                  <span className="font-medium text-foreground">
                    {beneficiary.highestEducation || "SSCE / WAEC"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </span>
                  <span className="font-medium text-foreground">
                    {beneficiary.stateOfResidence || "Oyo State"}
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment & Certification Status */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Assessment & Certification
              </h4>
              <div className="rounded-lg border bg-card p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Practical Assessment:
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    {trainee.assessmentPassed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>Passed</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">In Progress</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Certificate Issuance:
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    {trainee.certificateIssued ? (
                      <>
                        <Award className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>Issued</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        Pending Completion
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            Close
          </Button>
          {onOpenDrop && trainee.status === "Active" && (
            <Button
              variant="destructive"
              onClick={() => {
                onClose();
                onOpenDrop(trainee);
              }}
              className="text-xs font-semibold gap-1.5 flex-1"
            >
              <UserX className="h-3.5 w-3.5" /> Drop Trainee
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
