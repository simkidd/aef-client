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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { useUpdateApplicationStatusMutation } from "@/hooks/mutations";
import { Application } from "@/interfaces";
import {
  UserCheck,
  Sparkles,
  GraduationCap,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react";

interface ReviewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

const DECISION_STATUS_OPTIONS = [
  {
    value: "Selected",
    label: "Selected (Advance to Verification & Biometric Desk)",
  },
  {
    value: "Shortlisted",
    label: "Shortlisted (Under Consideration)",
  },
  {
    value: "Under Review",
    label: "Under Review (Additional Assessment Needed)",
  },
  {
    value: "Rejected",
    label: "Rejected (Does Not Meet Criteria)",
  },
];

export function ReviewApplicationModal({
  isOpen,
  onClose,
  application,
}: ReviewApplicationModalProps) {
  const [reviewStatus, setReviewStatus] = useState("Selected");
  const [reviewReason, setReviewReason] = useState("");

  const updateStatusMutation = useUpdateApplicationStatusMutation({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (application) {
      setReviewStatus(
        application.status === "Submitted" ||
          application.status === "Under Review"
          ? "Selected"
          : application.status,
      );
      setReviewReason("");
    }
  }, [application, isOpen]);

  if (!application) return null;

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusMutation.mutate({
      id: application._id,
      status: reviewStatus,
      reason: reviewReason.trim() || `Status updated to ${reviewStatus}`,
    });
  };

  const selectedDecisionLabel =
    DECISION_STATUS_OPTIONS.find((opt) => opt.value === reviewStatus)?.label ||
    reviewStatus;

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
      <DialogContent className="sm:max-w-lg flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Application Review & Decision
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Candidate:{" "}
                <span className="font-semibold text-foreground">
                  {application.beneficiaryId?.firstName}{" "}
                  {application.beneficiaryId?.lastName}
                </span>{" "}
                •{" "}
                <span className="font-mono text-muted-foreground">
                  {application.applicationNumber}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleConfirmReview} className="flex flex-col flex-1">
          <FieldGroup className="py-6 px-2 text-xs">
            {/* Candidate Summary Card */}
            <div className="rounded-lg bg-muted/40 border p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Target
                  Track:
                </span>
                <span className="font-semibold text-foreground">
                  {application.preferredSkillAreaId?.name || "Unassigned"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                  Education:
                </span>
                <span className="font-medium text-foreground">
                  {application.beneficiaryId?.highestEducation || "SSCE / WAEC"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                  Location:
                </span>
                <span className="font-medium text-foreground">
                  {application.beneficiaryId?.stateOfResidence || "Oyo State"}
                </span>
              </div>

              {application.statementOfPurpose && (
                <div className="pt-2 border-t mt-2">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mb-1">
                    <FileText className="h-3 w-3" /> Statement of Purpose
                  </span>
                  <p className="text-muted-foreground italic text-[11px] line-clamp-3 bg-card p-2 rounded border">
                    "{application.statementOfPurpose}"
                  </p>
                </div>
              )}
            </div>

            {/* Set Decision Status */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-foreground">
                Set Decision Status <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={reviewStatus}
                onValueChange={(val) => setReviewStatus(val || "Selected")}
              >
                <SelectTrigger className="w-full text-xs h-9 min-h-9">
                  <SelectValue placeholder="Select decision status">
                    {selectedDecisionLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DECISION_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Reviewer Justification */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-foreground">
                Reviewer Justification / Audit Notes
              </FieldLabel>
              <Textarea
                rows={3}
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                placeholder="e.g. Candidate meets qualification threshold and demonstrates strong practical aptitude."
                className="text-xs resize-none"
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="p-4 border-t bg-muted/40 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateStatusMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateStatusMutation.isPending}
              className="text-xs font-semibold gap-1.5"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Decision...</span>
                </>
              ) : (
                <>
                  <span>Save Decision</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
