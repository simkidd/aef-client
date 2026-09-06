"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { TrainingSession } from "@/interfaces/program.interface";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Layers,
  BookOpen,
  Building,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  ExternalLink,
  ClipboardList,
  Sparkles,
} from "lucide-react";

interface CalendarEventDetailsSheetProps {
  event: TrainingSession | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalendarEventDetailsSheet: React.FC<CalendarEventDetailsSheetProps> = ({
  event,
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();

  if (!event) return null;

  const formattedDate = event.sessionDate
    ? formatDate(event.sessionDate)
    : "Unscheduled";

  const cohortName =
    typeof event.cohortId === "object"
      ? event.cohortId?.name
      : "Cohort Alpha";

  const programTitle =
    typeof event.programId === "object"
      ? event.programId?.title
      : "Vocational Skills Initiative";

  const skillTrackName =
    typeof event.skillAreaId === "object"
      ? event.skillAreaId?.name
      : "Core Technical Module";

  const centreName =
    typeof event.centreId === "object"
      ? event.centreId?.name
      : "Central Hub";

  const roomName =
    typeof event.roomId === "object"
      ? event.roomId?.name
      : event.roomId
      ? `Room #${event.roomId}`
      : "Primary Lab / Workshop";

  const trainer =
    typeof event.trainerStaffId === "object"
      ? event.trainerStaffId
      : null;

  const trainerName = trainer
    ? `${trainer.firstName || ""} ${trainer.lastName || ""}`.trim() ||
      trainer.user?.name ||
      "Lead Instructor"
    : "Lead Instructor";

  return (
    <Sheet
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          onOpenChange(false);
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
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    {event._id?.slice(-8).toUpperCase() || "SESSION"}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 h-5 font-medium bg-primary/5 text-primary border-primary/20"
                  >
                    {event.sessionType || "Lecture"}
                  </Badge>
                </div>
                <StatusBadge
                  status={event.isCancelled ? "Cancelled" : "Scheduled"}
                  size="sm"
                />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-2">
                {event.topic || "Training Calendar Session"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {programTitle} • {cohortName}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card/60 p-3 space-y-1 shadow-2xs">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Scheduled Date
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </span>
              </div>
              <div className="rounded-xl border bg-card/60 p-3 space-y-1 shadow-2xs">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Time Window
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {event.startTime || "09:00"} – {event.endTime || "12:00"}
                  </span>
                </span>
              </div>
              <div className="rounded-xl border bg-card/60 p-3 space-y-1 shadow-2xs">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Centre / Hub
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate">
                  <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{centreName}</span>
                </span>
              </div>
              <div className="rounded-xl border bg-card/60 p-3 space-y-1 shadow-2xs">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Room & Facility
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{roomName}</span>
                </span>
              </div>
            </div>

            {/* Academic & Curriculum Section */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-wider uppercase">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Curriculum & Program Structure</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Skill Area / Track
                  </span>
                  <span className="font-semibold text-primary block truncate">
                    {skillTrackName}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Assigned Cohort
                  </span>
                  <span className="font-medium text-foreground block truncate">
                    {cohortName}
                  </span>
                </div>
                <div className="col-span-2 space-y-1 pt-1 border-t">
                  <span className="text-[11px] text-muted-foreground block">
                    Full Program
                  </span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{programTitle}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Facilitator & Trainer Card */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-wider uppercase">
                <User className="h-4 w-4 text-primary" />
                <span>Instructor & Delivery</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {trainerName[0] || "T"}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {trainerName}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {trainer?.specialization || "Certified Vocational Trainer"}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                >
                  Active Instructor
                </Badge>
              </div>
            </div>

            {/* Attendance & Biometric Integration */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-wider uppercase">
                <Fingerprint className="h-4 w-4 text-primary" />
                <span>Attendance & Verification Mode</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Biometric Fingerprint & QR Check-in Ready</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    router.push("/admin/training/attendance");
                  }}
                  className="h-7 text-[11px] gap-1 px-2 border-primary/20 text-primary hover:bg-primary/10"
                >
                  <ClipboardList className="h-3 w-3" />
                  Attendance Sheet
                </Button>
              </div>
            </div>

            {/* Cancellation Notice if applicable */}
            {event.isCancelled && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 space-y-1.5 text-xs text-destructive">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Session Cancelled</span>
                </div>
                {event.cancellationReason && (
                  <p className="text-muted-foreground pl-6">
                    Reason: {event.cancellationReason}
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40 flex flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-xs"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push("/admin/training/attendance");
            }}
            className="flex-1 text-xs bg-primary text-primary-foreground gap-1.5"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Open Attendance
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

