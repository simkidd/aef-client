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
import { TrainingSession } from "@/interfaces";
import {
  Clock,
  MapPin,
  User,
  BookOpen,
  Calendar,
  Building,
  AlertTriangle,
  Layers,
  GraduationCap,
} from "lucide-react";

interface SessionDetailsSheetProps {
  session: TrainingSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SessionDetailsSheet({
  session,
  isOpen,
  onClose,
}: SessionDetailsSheetProps) {
  if (!session) return null;

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
                  Session #{session._id?.slice(0, 8)}
                </span>
                <StatusBadge
                  status={session.isCancelled ? "Cancelled" : "Scheduled"}
                  size="sm"
                />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {session.topic || session.skillAreaId?.name || "Training Session"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {session.sessionType || "Practical Workshop"} •{" "}
                {session.cohortId?.name || "Active Cohort"}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Session Date
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{formatDate(session.sessionDate)}</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Time Window
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {session.startTime} – {session.endTime}
                  </span>
                </span>
              </div>
            </div>

            {/* Curriculum Track */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Curriculum & Program Context
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5" /> Program
                  </span>
                  <span className="font-medium text-foreground">
                    {session.programId?.title || "Vocational Skills Program"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Cohort
                  </span>
                  <span className="font-medium text-foreground">
                    {session.cohortId?.name || "Cohort Alpha"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" /> Skill Area
                  </span>
                  <span className="font-medium text-foreground">
                    {session.skillAreaId?.name || "Core Technical Skills"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Facilitator */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Location & Trainer
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building className="h-3.5 w-3.5" /> Training Centre
                  </span>
                  <span className="font-medium text-foreground">
                    {session.centreId?.name || "Main Hub Facility"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> Room / Workshop
                  </span>
                  <span className="font-medium text-foreground">
                    {session.roomId?.name || "Primary Practical Lab"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Lead Instructor
                  </span>
                  <span className="font-medium text-foreground">
                    {session.trainerStaffId
                      ? `${session.trainerStaffId.firstName} ${session.trainerStaffId.lastName}`
                      : "Unassigned Trainer"}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation Notice if applicable */}
            {session.isCancelled && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 space-y-1 text-xs text-destructive">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Session Cancelled</span>
                </div>
                {session.cancellationReason && (
                  <p className="text-muted-foreground pl-6">
                    Reason: {session.cancellationReason}
                  </p>
                )}
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
