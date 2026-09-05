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
  Calendar,
  Sparkles,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  Briefcase,
  History,
} from "lucide-react";
import { Application } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface ApplicationDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onOpenReview?: (app: Application) => void;
}

export function ApplicationDetailsSheet({
  isOpen,
  onClose,
  application,
  onOpenReview,
}: ApplicationDetailsSheetProps) {
  if (!application) return null;

  const beneficiary = application.beneficiaryId || {};

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
                  {application.applicationNumber}
                </span>
                <StatusBadge status={application.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {beneficiary.firstName} {beneficiary.lastName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Submitted on {formatDate(application.submittedAt)}
              </SheetDescription>
            </SheetHeader>

            {/* Target Program & Skill Track */}
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-wider uppercase">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Program & Skill Preferences</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Preferred Skill Track
                  </span>
                  <span className="font-semibold text-primary block">
                    {application.preferredSkillAreaId?.name || "General Track"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Assigned / Target Program
                  </span>
                  <span className="font-medium text-foreground block">
                    {application.programId?.title || "AEF Vocational Initiative"}
                  </span>
                </div>
                <div className="col-span-2 space-y-1 pt-1 border-t">
                  <span className="text-[11px] text-muted-foreground block">
                    Preferred Training Centre
                  </span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>
                      {application.preferredCentreId?.name || "Main Technology & Vocational Hub"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Personal & Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Candidate Details
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
                    <GraduationCap className="h-3.5 w-3.5" /> Highest Education
                  </span>
                  <span className="font-medium text-foreground">
                    {beneficiary.highestEducation || "SSCE / WAEC"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Gender
                  </span>
                  <span className="font-medium text-foreground capitalize">
                    {beneficiary.gender || "Not Specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> State / LGA of Residence
                  </span>
                  <span className="font-medium text-foreground">
                    {beneficiary.stateOfResidence || "Oyo"} • {beneficiary.lgaOfResidence || "Ibadan North"}
                  </span>
                </div>
              </div>
            </div>

            {/* Statement of Purpose & Background */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Candidate Statements & Experience
              </h4>
              <div className="space-y-3 text-xs">
                <div className="rounded-lg border bg-card p-3.5 space-y-1.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" /> Statement of Purpose
                  </span>
                  <p className="text-muted-foreground leading-relaxed italic bg-muted/30 p-2.5 rounded border">
                    {application.statementOfPurpose ||
                      "Candidate indicated strong passion for learning technical skills to gain economic independence and contribute to community growth."}
                  </p>
                </div>

                {application.previousExperience && (
                  <div className="rounded-lg border bg-card p-3.5 space-y-1.5">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-primary" /> Previous Experience
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {application.previousExperience}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status History / Audit Trail */}
            {application.statusHistory && application.statusHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Lifecycle Audit History
                </h4>
                <div className="rounded-lg border divide-y bg-card text-xs">
                  {application.statusHistory.map((hist, idx) => (
                    <div key={idx} className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {hist.status}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDate(hist.changedAt)}
                        </span>
                      </div>
                      {hist.reason && (
                        <p className="text-muted-foreground text-[11px]">
                          Note: {hist.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with Review Action */}
        <SheetFooter className="p-4 border-t bg-muted/40 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            Close
          </Button>
          {onOpenReview && (
            <Button
              onClick={() => {
                onClose();
                onOpenReview(application);
              }}
              className="flex-1 text-xs font-semibold gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Review Decision
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
