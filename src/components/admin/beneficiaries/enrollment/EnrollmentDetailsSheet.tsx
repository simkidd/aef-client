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
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  FileCheck,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { Enrollment } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface EnrollmentDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  onOpenVerify?: (enr: Enrollment) => void;
  onOpenBiometric?: (enr: Enrollment) => void;
}

export function EnrollmentDetailsSheet({
  isOpen,
  onClose,
  enrollment,
  onOpenVerify,
  onOpenBiometric,
}: EnrollmentDetailsSheetProps) {
  if (!enrollment) return null;

  const beneficiary = enrollment.beneficiaryId || {};
  const isVerified = Boolean(enrollment.verificationDetails?.identityVerified);
  const hasBiometrics = Boolean(
    enrollment.biometricRegistrationDetails?.biometricIdentifier
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
            <SheetHeader className="p-0 text-left border-b pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                  {enrollment.enrollmentCode || "Pending Code"}
                </span>
                <StatusBadge status={enrollment.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {beneficiary.firstName} {beneficiary.lastName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {enrollment.skillAreaId?.name || "Skill Track"} • {enrollment.centreId?.name || "Assigned Centre"}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Verification & Biometric Checklist Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3.5 space-y-2">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  1. Physical Verification
                </span>
                {isVerified ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Pending Check</span>
                  </div>
                )}
                {enrollment.verificationDetails?.verifiedAt && (
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    {formatDate(enrollment.verificationDetails.verifiedAt)}
                  </span>
                )}
              </div>

              <div className="rounded-lg border bg-card p-3.5 space-y-2">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  2. Biometric Template
                </span>
                {hasBiometrics ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Fingerprint className="h-4 w-4" />
                    <span>Captured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <span>Not Captured</span>
                  </div>
                )}
                {enrollment.biometricRegistrationDetails?.registeredAt && (
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    {formatDate(enrollment.biometricRegistrationDetails.registeredAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Assigned Cohort & Centre */}
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Training Cohort & Location
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Assigned Cohort
                  </span>
                  <span className="font-semibold text-foreground block">
                    {enrollment.cohortId?.name || "Active Cohort"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Skill Area Track
                  </span>
                  <span className="font-semibold text-primary block">
                    {enrollment.skillAreaId?.name || "General Track"}
                  </span>
                </div>
                <div className="col-span-2 space-y-1 pt-2 border-t">
                  <span className="text-[11px] text-muted-foreground block">
                    Training Centre Campus
                  </span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{enrollment.centreId?.name || "Main Hub"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Contact & Profile */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Candidate Information
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
                    <MapPin className="h-3.5 w-3.5" /> State of Residence
                  </span>
                  <span className="font-medium text-foreground">
                    {beneficiary.stateOfResidence || "Oyo State"}
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Verification Details If Present */}
            {enrollment.verificationDetails && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Verification Records
                </h4>
                <div className="rounded-lg border bg-card p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">WAEC / Credentials Checked:</span>
                    <span className="font-semibold text-foreground">
                      {enrollment.verificationDetails.documentsChecked ? "Yes" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">National ID / NIN Confirmed:</span>
                    <span className="font-semibold text-foreground">
                      {enrollment.verificationDetails.identityVerified ? "Yes" : "Pending"}
                    </span>
                  </div>
                  {enrollment.verificationDetails.physicalNotes && (
                    <div className="pt-2 border-t mt-2">
                      <span className="text-[11px] text-muted-foreground block mb-1">
                        Desk Officer Notes:
                      </span>
                      <p className="text-muted-foreground italic bg-muted/30 p-2 rounded border">
                        "{enrollment.verificationDetails.physicalNotes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with Quick Action Buttons */}
        <SheetFooter className="p-4 border-t bg-muted/40 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            Close
          </Button>
          {!isVerified && onOpenVerify && (
            <Button
              onClick={() => {
                onClose();
                onOpenVerify(enrollment);
              }}
              className="flex-1 text-xs font-semibold gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5" /> Verify Identity
            </Button>
          )}
          {isVerified && !hasBiometrics && onOpenBiometric && (
            <Button
              onClick={() => {
                onClose();
                onOpenBiometric(enrollment);
              }}
              className="flex-1 text-xs font-semibold gap-1.5"
            >
              <Fingerprint className="h-3.5 w-3.5" /> Capture Biometrics
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
