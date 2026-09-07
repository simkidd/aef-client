"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FieldGroup } from "@/components/ui/field";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useCorrectAttendanceMutation } from "@/hooks/mutations";
import { AttendanceRecord } from "@/interfaces";
import { formatDate, formatTime } from "@/lib/utils";

interface AttendanceCorrectionModalProps {
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const CORRECTION_STATUS_OPTIONS = [
  { value: "Present", label: "Present (Mark On-Time)" },
  { value: "Late", label: "Late (Mark Tardy)" },
  { value: "Excused", label: "Excused (Medical / Official Reason)" },
  { value: "Absent", label: "Absent (Unexcused Absence)" },
];

export function AttendanceCorrectionModal({
  record,
  isOpen,
  onClose,
}: AttendanceCorrectionModalProps) {
  const [newStatus, setNewStatus] = useState("Present");
  const [reason, setReason] = useState("");
  const correctMutation = useCorrectAttendanceMutation();

  useEffect(() => {
    if (record) {
      setNewStatus(record.status || "Present");
      setReason("");
    }
  }, [record]);

  if (!record) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;

    correctMutation.mutate(
      {
        id: record._id,
        status: newStatus,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          setReason("");
          onClose();
        },
      }
    );
  };

  const selectedStatusLabel =
    CORRECTION_STATUS_OPTIONS.find((s) => s.value === newStatus)?.label ||
    "Select New Status";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <ShieldAlert className="h-5 w-5" />
            <DialogTitle className="text-base font-bold font-heading text-foreground">
              Manual Attendance Correction & Audit
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Audited manual correction for{" "}
            <strong className="text-foreground">
              {record.beneficiaryId?.firstName} {record.beneficiaryId?.lastName}
            </strong>{" "}
            on {formatDate(record.date)}.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="py-4 space-y-4 text-xs">
          <div className="rounded-lg bg-muted/40 border border-border p-3 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Current Biometric Record State
            </span>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Current Status:</span>
              <strong className="text-primary">{record.status}</strong>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Clock In / Clock Out:</span>
              <span className="font-mono">
                {formatTime(record.firstClockIn)} /{" "}
                {formatTime(record.lastClockOut)}
              </span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">
              New Assigned Status <span className="text-destructive">*</span>
            </label>
            <Select
              value={newStatus}
              onValueChange={(val) => setNewStatus(val || "Present")}
            >
              <SelectTrigger className="w-full text-xs h-9 bg-background">
                <SelectValue placeholder="Select Status">
                  {selectedStatusLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CORRECTION_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">
              Audit Justification / Correction Reason{" "}
              <span className="text-destructive">*</span>
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. Verified by centre manager: biometric reader offline during morning punch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-background"
              required
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              This explanation is permanently committed to the immutable compliance log.
            </span>
          </div>
        </FieldGroup>

        <DialogFooter className="gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={correctMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={correctMutation.isPending || !reason.trim()}
            className="text-xs gap-1.5"
          >
            {correctMutation.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {correctMutation.isPending ? "Submitting Audit..." : "Apply Manual Correction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
