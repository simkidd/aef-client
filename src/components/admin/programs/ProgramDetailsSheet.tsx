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
  Briefcase,
  Building,
  Calendar,
  Layers,
  Users,
  GraduationCap,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Program } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { useProgramQuery } from "@/hooks";

interface ProgramDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onOpenEdit?: (program: Program) => void;
}

export function ProgramDetailsSheet({
  isOpen,
  onClose,
  program,
  onOpenEdit,
}: ProgramDetailsSheetProps) {
  const { data: detailData } = useProgramQuery(program?._id || "");

  if (!program) return null;

  // detailData returns { program, cohorts } from backend or the program directly
  const fullProgram = (detailData as any)?.program || detailData || program;
  const cohorts = (detailData as any)?.cohorts || [];

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
                  {fullProgram.code}
                </span>
                <StatusBadge status={fullProgram.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground">
                {fullProgram.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Organizer: <strong>{fullProgram.organizerName}</strong> (
                {fullProgram.organizerType}) • Role: {fullProgram.deliveryRole}
              </SheetDescription>
            </SheetHeader>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-teal-600" />
                Program Overview
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                {fullProgram.description}
              </p>
            </div>

            {/* Program Logistics & Settings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-600" />
                Timelines & Configuration
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-muted/20 text-xs">
                <div>
                  <span className="text-muted-foreground text-[11px] block">
                    Application Period
                  </span>
                  <span className="font-semibold text-foreground">
                    {fullProgram.applicationStartDate
                      ? formatDate(fullProgram.applicationStartDate)
                      : "Open"}{" "}
                    –{" "}
                    {fullProgram.applicationDeadline
                      ? formatDate(fullProgram.applicationDeadline)
                      : "Ongoing"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">
                    Delivery Model
                  </span>
                  <span className="font-semibold text-foreground">
                    {fullProgram.deliveryRole || "Primary Host"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">
                    Visibility
                  </span>
                  <span className="font-semibold text-foreground">
                    {fullProgram.published
                      ? "Published (Live)"
                      : "Draft (Hidden)"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">
                    Target Intake Capacity
                  </span>
                  <span className="font-semibold text-foreground">
                    {fullProgram.maxSlots ? `${fullProgram.maxSlots} Seats` : "Unlimited"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">
                    Featured Status
                  </span>
                  <span className="font-semibold text-foreground">
                    {fullProgram.isFeatured ? "Featured Banner" : "Standard"}
                  </span>
                </div>
              </div>
            </div>

            {/* Integrated Skill Disciplines */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-teal-600" />
                  Integrated Skill Disciplines (
                  {fullProgram.skillAreaIds?.length || 0})
                </h4>
              </div>

              <div className="space-y-2">
                {fullProgram.skillAreaIds &&
                fullProgram.skillAreaIds.length > 0 ? (
                  fullProgram.skillAreaIds.map((skill: any, idx: number) => (
                    <div
                      key={skill._id || idx}
                      className="p-3 rounded-lg border border-border bg-card flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">
                            {skill.name || "Discipline Track"}
                          </span>
                          <span className="font-mono text-[10px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800 text-nowrap">
                            {skill.code}
                          </span>
                        </div>
                        {skill.category && (
                          <span className="text-[11px] text-muted-foreground block mt-0.5">
                            Category: {skill.category} • Standard Duration:{" "}
                            {skill.defaultDurationWeeks || 8} Weeks
                          </span>
                        )}
                      </div>
                      {skill.certificationType && (
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded whitespace-nowrap">
                          {skill.certificationType}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No skill areas associated with this program.
                  </p>
                )}
              </div>
            </div>

            {/* Associated Cohorts */}
            {cohorts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-teal-600" />
                  Active Cohorts ({cohorts.length})
                </h4>
                <div className="space-y-2">
                  {cohorts.map((coh: any) => (
                    <div
                      key={coh._id}
                      className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-foreground">
                          {coh.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Centre: {coh.centreId?.name || "Multiple"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDate(coh.startDate)} – {formatDate(coh.endDate)}
                        </span>
                      </div>
                      <StatusBadge status={coh.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                onOpenEdit(fullProgram);
              }}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Program
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
