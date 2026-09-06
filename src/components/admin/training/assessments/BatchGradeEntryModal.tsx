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
import { Input } from "@/components/ui/input";
import { FieldGroup } from "@/components/ui/field";
import { Loader2, Award, User } from "lucide-react";
import { useBatchGradeMutation } from "@/hooks/mutations";
import { Assessment, Enrollment } from "@/interfaces";

interface BatchGradeEntryModalProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
  activeTrainees?: Enrollment[];
}

export function BatchGradeEntryModal({
  assessment,
  isOpen,
  onClose,
  activeTrainees = [],
}: BatchGradeEntryModalProps) {
  const [gradeScores, setGradeScores] = useState<Record<string, number>>({});
  const batchGradeMutation = useBatchGradeMutation();

  if (!assessment) return null;

  const handleConfirmGrades = () => {
    if (!activeTrainees.length) return;

    const batch = activeTrainees.map((t) => ({
      beneficiaryId: (t.beneficiaryId?._id || t.beneficiaryId) as string,
      enrollmentId: t._id,
      score:
        gradeScores[t._id] !== undefined
          ? gradeScores[t._id]
          : assessment.passingScore || 75,
      remarks: "Competency verified during practical evaluation.",
    }));

    batchGradeMutation.mutate(
      {
        assessmentId: assessment._id,
        batch,
      },
      {
        onSuccess: () => {
          setGradeScores({});
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" />
            <DialogTitle className="text-base font-bold font-heading text-foreground">
              Enter Assessment Grades
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Scoring: <strong className="text-foreground">{assessment.title}</strong>{" "}
            (Max Score: {assessment.maxScore || 100}, Pass Mark:{" "}
            {assessment.passingScore || 70})
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="py-4 text-xs max-h-80 overflow-y-auto space-y-2">
          {activeTrainees.length > 0 ? (
            activeTrainees.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/40"
              >
                <div>
                  <span className="font-bold text-foreground block">
                    {t.beneficiaryId?.firstName} {t.beneficiaryId?.lastName}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {t.enrollmentCode || t.beneficiaryId?.beneficiaryCode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-[11px]">Score:</span>
                  <Input
                    type="number"
                    min={0}
                    max={assessment.maxScore || 100}
                    defaultValue={gradeScores[t._id] ?? assessment.passingScore ?? 80}
                    className="w-20 h-8 text-xs font-bold text-center bg-background"
                    onChange={(e) =>
                      setGradeScores({
                        ...gradeScores,
                        [t._id]: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <User className="h-6 w-6 mx-auto mb-1 text-muted-foreground/50" />
              <p>No active enrolled trainees found in this cohort track.</p>
            </div>
          )}
        </FieldGroup>

        <DialogFooter className="gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={batchGradeMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirmGrades}
            disabled={batchGradeMutation.isPending || activeTrainees.length === 0}
            className="text-xs gap-1.5"
          >
            {batchGradeMutation.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {batchGradeMutation.isPending
              ? "Recording Grades..."
              : `Submit ${activeTrainees.length} Grades`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
