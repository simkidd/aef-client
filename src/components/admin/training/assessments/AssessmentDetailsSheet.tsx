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
import { Assessment } from "@/interfaces";
import {
  Award,
  Calendar,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Layers,
  GraduationCap,
  Percent,
} from "lucide-react";

interface AssessmentDetailsSheetProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenGrading?: (assessment: Assessment) => void;
}

export function AssessmentDetailsSheet({
  assessment,
  isOpen,
  onClose,
  onOpenGrading,
}: AssessmentDetailsSheetProps) {
  if (!assessment) return null;

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
                  Eval #{assessment._id?.slice(0, 8)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {assessment.type}
                </span>
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {assessment.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {assessment.skillAreaId?.name || "Skill Area"} •{" "}
                {assessment.cohortId?.name || "All Cohorts"}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Max Possible Score
                </span>
                <span className="text-base font-bold text-foreground font-heading flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  <span>{assessment.maxScore || 100} pts</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Passing Threshold
                </span>
                <span className="text-base font-bold text-emerald-500 font-heading flex items-center gap-1.5">
                  <Percent className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{assessment.passingScore || 70} pts</span>
                </span>
              </div>
            </div>

            {/* Academic Context */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Curriculum & Scheduling
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" /> Skill Discipline
                  </span>
                  <span className="font-medium text-foreground">
                    {assessment.skillAreaId?.name || "General Track"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Target Cohort
                  </span>
                  <span className="font-medium text-foreground">
                    {assessment.cohortId?.name || "Cohort Alpha"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Scheduled Evaluation Date
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(assessment.scheduledDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description if present */}
            {assessment.description && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Assessment Overview
                </h4>
                <div className="p-3.5 rounded-lg border bg-card text-xs text-muted-foreground leading-relaxed">
                  {assessment.description}
                </div>
              </div>
            )}

            {/* Evaluation Rubrics / Criteria */}
            {assessment.criteria && assessment.criteria.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Evaluation Rubrics & Competencies
                </h4>
                <div className="rounded-lg border divide-y bg-card text-xs">
                  {assessment.criteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-foreground block">
                          {crit.name}
                        </span>
                        {crit.description && (
                          <p className="text-[11px] text-muted-foreground">
                            {crit.description}
                          </p>
                        )}
                      </div>
                      <span className="font-mono font-bold text-primary shrink-0 bg-primary/10 px-2 py-0.5 rounded text-xs">
                        {crit.maxPoints} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grade Submission Action Card */}
            {onOpenGrading && (
              <div className="rounded-lg border p-3.5 bg-card space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <span>Gradebook Entry</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Batch scoring
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenGrading(assessment);
                  }}
                  className="w-full text-xs font-semibold gap-2 mt-1"
                >
                  <Award className="h-3.5 w-3.5" /> Record Trainee Grades
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
