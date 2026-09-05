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
  MapPin,
  Mail,
  Phone,
  Users,
  DoorOpen,
  Fingerprint,
  GraduationCap,
  UserCheck,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Laptop,
} from "lucide-react";
import { TrainingCentre } from "@/interfaces";
import { useCentreQuery } from "@/hooks";

interface CentreDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  centre: TrainingCentre | null;
  onOpenEdit?: (centre: TrainingCentre) => void;
}

export function CentreDetailsSheet({
  isOpen,
  onClose,
  centre,
  onOpenEdit,
}: CentreDetailsSheetProps) {
  const { data: detailData, isLoading } = useCentreQuery(centre?._id || "");

  if (!centre) return null;

  const currentCentre = detailData?.centre || centre;
  const rooms = detailData?.rooms || [];
  const devices = detailData?.devices || [];
  const cohorts = detailData?.cohorts || [];

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
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300">
                  {currentCentre.centreCode}
                </span>
                <StatusBadge status={currentCentre.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {currentCentre.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>
                  {currentCentre.address}, {currentCentre.lga},{" "}
                  {currentCentre.state} State
                </span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-lg border bg-card p-2.5 text-center space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Capacity
                </span>
                <span className="text-sm font-bold text-foreground block">
                  {currentCentre.capacity}
                </span>
                <span className="text-[9px] text-muted-foreground">Seats</span>
              </div>
              <div className="rounded-lg border bg-card p-2.5 text-center space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Rooms
                </span>
                <span className="text-sm font-bold text-teal-700 dark:text-teal-400 block">
                  {rooms.length || currentCentre.stats?.rooms || 0}
                </span>
                <span className="text-[9px] text-muted-foreground">Labs</span>
              </div>
              <div className="rounded-lg border bg-card p-2.5 text-center space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Scanners
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 block">
                  {devices.length || currentCentre.stats?.devices || 0}
                </span>
                <span className="text-[9px] text-muted-foreground">Online</span>
              </div>
              <div className="rounded-lg border bg-card p-2.5 text-center space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Cohorts
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                  {cohorts.length || currentCentre.stats?.activeCohorts || 0}
                </span>
                <span className="text-[9px] text-muted-foreground">Active</span>
              </div>
            </div>

            {/* Contact & Management */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Facility & Manager Contacts
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Centre Email
                  </span>
                  <span className="font-medium text-foreground select-all">
                    {currentCentre.contactEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Centre Phone
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {currentCentre.contactPhone}
                  </span>
                </div>
                {currentCentre.centreManagerId &&
                  typeof currentCentre.centreManagerId === "object" && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <UserCheck className="h-3.5 w-3.5 text-teal-600" />{" "}
                        Centre Manager
                      </span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground block">
                          {currentCentre.centreManagerId.firstName}{" "}
                          {currentCentre.centreManagerId.lastName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {currentCentre.centreManagerId.email}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Rooms & Laboratories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                  <DoorOpen className="h-3.5 w-3.5 text-teal-600" /> Rooms &
                  Laboratories ({rooms.length})
                </h4>
              </div>

              {rooms.length > 0 ? (
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <div
                      key={room._id}
                      className="rounded-lg border bg-card p-3 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-foreground">
                            {room.name}
                          </span>
                          {room.roomNumber && (
                            <span className="font-mono text-[10px] text-muted-foreground ml-2">
                              Room {room.roomNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                          {room.type} • {room.capacity} seats
                        </span>
                      </div>

                      {room.equipment && room.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {room.equipment.map((eq, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1"
                            >
                              <Laptop className="h-2.5 w-2.5" />
                              {eq}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No individual rooms or labs registered for this centre.
                </div>
              )}
            </div>

            {/* Biometric Scanners */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                Biometric Terminals ({devices.length})
              </h4>
              {devices.length > 0 ? (
                <div className="space-y-2">
                  {devices.map((device: any) => (
                    <div
                      key={device._id}
                      className="rounded-lg border bg-card p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground block">
                          {device.deviceName || device.deviceCode}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Serial: {device.serialNumber || device.macAddress || "N/A"}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Online
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No dedicated biometric hardware assigned to this centre yet.
                </div>
              )}
            </div>

            {/* Active Training Cohorts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-teal-600" />
                Active Cohorts ({cohorts.length})
              </h4>
              {cohorts.length > 0 ? (
                <div className="space-y-2">
                  {cohorts.map((cohort: any) => (
                    <div
                      key={cohort._id}
                      className="rounded-lg border bg-card p-3 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          {cohort.title || cohort.cohortName}
                        </span>
                        <StatusBadge status={cohort.status} size="sm" />
                      </div>
                      <span className="text-[11px] text-muted-foreground block">
                        Program: {cohort.programId?.title || "Technical Training"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No active training cohorts currently running at this centre.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40 flex flex-row gap-2 mt-auto">
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
                onOpenEdit(currentCentre);
              }}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit Centre
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
