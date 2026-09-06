"use client";

import React, { useState } from "react";
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
import { FieldGroup } from "@/components/ui/field";
import { Loader2, AlertTriangle } from "lucide-react";
import { useCancelSessionMutation } from "@/hooks/mutations";
import { TrainingSession } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface CancelSessionModalProps {
  session: TrainingSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelSessionModal({
  session,
  isOpen,
  onClose,
}: CancelSessionModalProps) {
  const [reason, setReason] = useState("");
  const cancelMutation = useCancelSessionMutation();

  if (!session) return null;

  const handleConfirm = () => {
    cancelMutation.mutate(
      { id: session._id, reason },
      {
        onSuccess: () => {
          setReason("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-base font-bold font-heading text-foreground">
              Cancel Scheduled Session
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Are you sure you want to cancel the session for{" "}
            <strong className="text-foreground">
              {session.skillAreaId?.name || "Training"}
            </strong>{" "}
            on {formatDate(session.sessionDate)} ({session.startTime} - {session.endTime})?
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="py-4 space-y-3 text-xs">
          <div>
            <label className="font-semibold text-foreground block mb-1">
              Reason for Cancellation (Optional)
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. Instructor medical leave, facility maintenance, weather closure..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-background"
            />
          </div>
        </FieldGroup>

        <DialogFooter className="gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={cancelMutation.isPending}
            className="text-xs"
          >
            Keep Session
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={cancelMutation.isPending}
            className="text-xs gap-1.5"
          >
            {cancelMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
