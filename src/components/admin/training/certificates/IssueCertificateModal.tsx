"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Centre, Cohort } from "@/interfaces";
import { useIssueCertificateMutation } from "@/hooks/queries/useCertificateQueries";
import { toast } from "sonner";

interface IssueCertificateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  centres: Centre[];
  cohorts: Cohort[];
  onCertificateIssued?: () => void;
}

export const IssueCertificateModal: React.FC<IssueCertificateModalProps> = ({
  isOpen,
  onOpenChange,
  centres,
  cohorts,
  onCertificateIssued,
}) => {
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSkillArea, setSelectedSkillArea] = useState("");
  const [attendanceRate, setAttendanceRate] = useState<number>(85);
  const [assessmentScore, setAssessmentScore] = useState<number>(88);
  const [grade, setGrade] = useState("Distinction");

  const issueMutation = useIssueCertificateMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryId || !selectedCohort || !selectedCentre) {
      toast.error("Please fill in all required fields for certificate issuance");
      return;
    }

    if (attendanceRate < 75) {
      toast.warning("Warning: Attendance rate is below recommended 75% threshold.");
    }

    try {
      await issueMutation.mutateAsync({
        beneficiaryId,
        enrollmentId: enrollmentId || beneficiaryId,
        cohortId: selectedCohort,
        centreId: selectedCentre,
        programId: selectedProgram || selectedCohort,
        skillAreaId: selectedSkillArea || selectedCohort,
        overallAttendanceRate: attendanceRate,
        overallAssessmentScore: assessmentScore,
        grade,
      });

      toast.success("Certificate issued and registered with cryptographic QR code");
      onOpenChange(false);
      if (onCertificateIssued) onCertificateIssued();
      // Reset
      setBeneficiaryId("");
      setEnrollmentId("");
      setSelectedCohort("");
      setSelectedCentre("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to issue certificate");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-heading text-foreground">
                  Issue Accredited Certificate
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Generate a tamper-proof credential with public verification code.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="ben-id" className="text-xs font-medium text-foreground">
                Beneficiary ID / Student ID *
              </Label>
              <Input
                id="ben-id"
                placeholder="e.g. 64f1a2b3c4d5e6f7a8b9c0d1"
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                className="h-9 text-xs bg-background border-border text-foreground font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Cohort *
                </Label>
                <Select
                  value={selectedCohort}
                  onValueChange={(val) => {
                    setSelectedCohort(val || "");
                    const found = cohorts.find(
                      (c) => (c._id || (c as any).id) === val
                    );
                    if (found) {
                      setSelectedProgram(
                        typeof found.programId === "object"
                          ? found.programId?._id
                          : found.programId || ""
                      );
                      setSelectedCentre(
                        typeof found.centreId === "object"
                          ? found.centreId?._id
                          : found.centreId || ""
                      );
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map((c) => (
                      <SelectItem
                        key={c._id || (c as any).id}
                        value={c._id || (c as any).id}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Centre / Hub *
                </Label>
                <Select
                  value={selectedCentre}
                  onValueChange={(val) => setSelectedCentre(val || "")}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {centres.map((c) => (
                      <SelectItem
                        key={c.id || (c as any)._id}
                        value={c.id || (c as any)._id}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="att-rate"
                  className="text-xs font-medium text-foreground"
                >
                  Attendance %
                </Label>
                <Input
                  id="att-rate"
                  type="number"
                  min={0}
                  max={100}
                  value={attendanceRate}
                  onChange={(e) => setAttendanceRate(Number(e.target.value))}
                  className="h-9 text-xs bg-background border-border text-foreground font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="score"
                  className="text-xs font-medium text-foreground"
                >
                  Score %
                </Label>
                <Input
                  id="score"
                  type="number"
                  min={0}
                  max={100}
                  value={assessmentScore}
                  onChange={(e) => setAssessmentScore(Number(e.target.value))}
                  className="h-9 text-xs bg-background border-border text-foreground font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Grade
                </Label>
                <Select
                  value={grade}
                  onValueChange={(val) => setGrade(val || "Pass")}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Distinction">Distinction</SelectItem>
                    <SelectItem value="Merit">Merit</SelectItem>
                    <SelectItem value="Pass">Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 border-border text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={issueMutation.isPending}
              className="h-9 bg-primary text-primary-foreground"
            >
              {issueMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Issuing...
                </>
              ) : (
                "Issue Certificate"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
