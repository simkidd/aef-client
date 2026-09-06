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
import { BiometricEvent } from "@/interfaces";
import {
  Fingerprint,
  Calendar,
  Clock,
  MapPin,
  Cpu,
  User,
  CheckCircle2,
  AlertCircle,
  Hash,
  Activity,
} from "lucide-react";

interface ScanDetailsSheetProps {
  event: BiometricEvent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScanDetailsSheet({
  event,
  isOpen,
  onOpenChange,
}: ScanDetailsSheetProps) {
  if (!event) return null;

  const benName = event.beneficiaryId
    ? typeof event.beneficiaryId === "object"
      ? `${event.beneficiaryId.firstName || ""} ${event.beneficiaryId.lastName || ""}`.trim() ||
        event.beneficiaryId.fullName ||
        "Matched Trainee"
      : "Matched Trainee"
    : "Unknown / Unlinked Trainee";

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
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                  Log #{event._id?.slice(0, 8)}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    event.isMatched
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}
                >
                  {event.isMatched ? "Matched & Processed" : "Review Needed"}
                </span>
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {benName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground font-mono">
                Device {event.deviceSerial} • {formatDate(event.timestamp, true)}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Scan Direction
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                  <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Direction: {event.scanType} (Gate Access)</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Verification Status
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {event.isMatched ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-emerald-500">Biometric Match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="text-amber-500">Unknown Fingerprint</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Trainee & Biometric Token Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Biometric Identification Data
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Enrolled Name
                  </span>
                  <span className="font-medium text-foreground">{benName}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Fingerprint className="h-3.5 w-3.5" /> Biometric Token Hash
                  </span>
                  <span className="font-mono text-muted-foreground text-[11px] max-w-[200px] truncate select-all">
                    {event.biometricToken || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Exact Timestamp
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(event.timestamp, true)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware & Location Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Hardware Device & Origin Gate
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5" /> Device Serial
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {event.deviceSerial}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> Training Hub / Location
                  </span>
                  <span className="font-medium text-foreground">
                    {typeof event.centreId === "object"
                      ? event.centreId?.name
                      : "Main Hub Turnstile Gate"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
