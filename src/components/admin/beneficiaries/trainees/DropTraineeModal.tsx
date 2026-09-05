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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { useDropTraineeMutation } from "@/hooks/mutations";
import { Enrollment } from "@/interfaces";
import { ShieldAlert, UserX, AlertTriangle, Loader2 } from "lucide-react";

interface DropTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: Enrollment | null;
}

export function DropTraineeModal({
  isOpen,
  onClose,
  trainee,
}: DropTraineeModalProps) {
  const [dropReason, setDropReason] = useState("");

  const dropMutation = useDropTraineeMutation({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (trainee) {
      setDropReason("");
    }
  }, [trainee, isOpen]);

  if (!trainee) return null;

  const handleConfirmDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropReason.trim()) return;
    dropMutation.mutate({
      id: trainee._id,
      reason: dropReason.trim(),
    });
  };

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, details) => {
        if (!open && details?.reason !== "outside-press") {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Drop Trainee from Active Cohort
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Trainee:{" "}
                <span className="font-semibold text-foreground">
                  {trainee.beneficiaryId?.firstName}{" "}
                  {trainee.beneficiaryId?.lastName}
                </span>{" "}
                •{" "}
                <span className="font-mono text-muted-foreground">
                  {trainee.enrollmentCode}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleConfirmDrop} className="flex flex-col flex-1">
          <FieldGroup className="p-6 space-y-4 text-xs">
            {/* Non-destructive audit warning notice */}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3.5 text-amber-900 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Non-Destructive Historical Preservation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-400">
                The trainee's past attendance sessions and assessment records
                will remain permanently in the audit history. Their cohort slot
                will immediately be made available for replacement candidates.
              </p>
            </div>

            {/* Mandatory Justification */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-foreground">
                Mandatory Administrative Justification{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                required
                rows={3}
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                placeholder="e.g. Unexcused absence exceeding threshold (3 consecutive unnotified training days) or candidate voluntary withdrawal."
                className="text-xs resize-none"
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="p-4 border-t bg-muted/40 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={dropMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!dropReason.trim() || dropMutation.isPending}
              className="text-xs font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-1.5"
            >
              {dropMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Confirm Drop & Audit</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
