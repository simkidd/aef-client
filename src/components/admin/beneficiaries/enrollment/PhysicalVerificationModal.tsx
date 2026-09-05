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
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { useVerifyPhysicalMutation } from "@/hooks/mutations";
import { Enrollment } from "@/interfaces";
import {
  UserCheck,
  ShieldCheck,
  FileCheck,
  IdCard,
  Loader2,
} from "lucide-react";

interface PhysicalVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
}

export function PhysicalVerificationModal({
  isOpen,
  onClose,
  enrollment,
}: PhysicalVerificationModalProps) {
  const [docsChecked, setDocsChecked] = useState(true);
  const [idVerified, setIdVerified] = useState(true);
  const [physicalNotes, setPhysicalNotes] = useState("");

  const verifyMutation = useVerifyPhysicalMutation({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (enrollment) {
      setDocsChecked(true);
      setIdVerified(true);
      setPhysicalNotes("");
    }
  }, [enrollment, isOpen]);

  if (!enrollment) return null;

  const handleConfirmVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({
      id: enrollment._id,
      payload: {
        documentsChecked: docsChecked,
        identityVerified: idVerified,
        physicalNotes: physicalNotes.trim() || undefined,
      },
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
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Physical Identity & Document Verification
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Candidate:{" "}
                <span className="font-semibold text-foreground">
                  {enrollment.beneficiaryId?.firstName}{" "}
                  {enrollment.beneficiaryId?.lastName}
                </span>{" "}
                •{" "}
                <span className="text-muted-foreground">
                  {enrollment.centreId?.name || "Assigned Centre"}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleConfirmVerify} className="flex flex-col flex-1">
          <FieldGroup className="p-6 space-y-4 text-xs">
            {/* Checklist items using Shadcn Checkbox */}
            <div className="rounded-lg bg-muted/40 border p-3.5 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={docsChecked}
                  onCheckedChange={(checked) =>
                    setDocsChecked(Boolean(checked))
                  }
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-primary" />{" "}
                    Educational Documents Verified
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Confirmed original WAEC / SSCE / relevant certificates
                    against candidate credentials.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t">
                <Checkbox
                  checked={idVerified}
                  onCheckedChange={(checked) => setIdVerified(Boolean(checked))}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <IdCard className="h-3.5 w-3.5 text-primary" /> Government
                    ID / NIN Confirmed
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Physical candidate matches national identity slip, facial
                    likeness, and voter card.
                  </p>
                </div>
              </label>
            </div>

            {/* Verification Officer Notes */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-foreground">
                Verification Desk Notes (Optional)
              </FieldLabel>
              <Textarea
                rows={2}
                value={physicalNotes}
                onChange={(e) => setPhysicalNotes(e.target.value)}
                placeholder="e.g. Original credentials confirmed. All details match registration database."
                className="text-xs resize-none"
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="p-4 border-t bg-muted/40 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={verifyMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!docsChecked || !idVerified || verifyMutation.isPending}
              className="text-xs font-semibold gap-1.5"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Approve Physical Verification</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
