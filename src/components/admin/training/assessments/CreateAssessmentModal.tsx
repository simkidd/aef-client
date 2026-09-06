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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FieldGroup } from "@/components/ui/field";
import { Loader2, Award } from "lucide-react";
import { useCreateAssessmentMutation } from "@/hooks/mutations";
import { Cohort, SkillArea } from "@/interfaces";

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohorts?: Cohort[];
  skillAreas?: SkillArea[];
}

const ASSESSMENT_TYPES = [
  { value: "Practical Evaluation", label: "Practical Evaluation" },
  { value: "Theory Exam", label: "Theory Exam" },
  { value: "Mid-Term Assessment", label: "Mid-Term Assessment" },
  { value: "Final Capstone Project", label: "Final Capstone Project" },
  { value: "Competency Verification", label: "Competency Verification" },
];

export function CreateAssessmentModal({
  isOpen,
  onClose,
  cohorts = [],
  skillAreas = [],
}: CreateAssessmentModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Practical Evaluation");
  const [cohortId, setCohortId] = useState("");
  const [skillAreaId, setSkillAreaId] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [passingScore, setPassingScore] = useState(70);
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");

  const createMutation = useCreateAssessmentMutation();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !cohortId || !skillAreaId) return;

    createMutation.mutate(
      {
        title: title.trim(),
        type,
        cohortId: cohortId as any,
        skillAreaId: skillAreaId as any,
        maxScore,
        passingScore,
        scheduledDate: scheduledDate as any,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          onClose();
        },
      }
    );
  };

  const selectedTypeLabel =
    ASSESSMENT_TYPES.find((t) => t.value === type)?.label || "Select Type";

  const selectedCohortLabel =
    cohorts.find((c) => c._id === cohortId)?.name || "Select Cohort";

  const selectedSkillLabel =
    skillAreas.find((s) => s._id === skillAreaId)?.name || "Select Skill Area";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" />
            <DialogTitle className="text-base font-bold font-heading text-foreground">
              Schedule New Assessment
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Configure practical benchmarks, theory tests, or capstone evaluation criteria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4 py-4 text-xs">
          <FieldGroup className="space-y-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Assessment Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Solar PV Installation Practical Evaluation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-xs bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Evaluation Type
                </label>
                <Select
                  value={type}
                  onValueChange={(val) => setType(val || "Practical Evaluation")}
                >
                  <SelectTrigger className="w-full text-xs h-9 bg-background">
                    <SelectValue>{selectedTypeLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ASSESSMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Scheduled Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="text-xs bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Target Cohort <span className="text-destructive">*</span>
                </label>
                <Select
                  value={cohortId}
                  onValueChange={(val) => setCohortId(val || "")}
                >
                  <SelectTrigger className="w-full text-xs h-9 bg-background">
                    <SelectValue placeholder="Select Cohort">
                      {selectedCohortLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Skill Area Track <span className="text-destructive">*</span>
                </label>
                <Select
                  value={skillAreaId}
                  onValueChange={(val) => setSkillAreaId(val || "")}
                >
                  <SelectTrigger className="w-full text-xs h-9 bg-background">
                    <SelectValue placeholder="Select Track">
                      {selectedSkillLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {skillAreas.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Max Possible Score
                </label>
                <Input
                  type="number"
                  min={1}
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="text-xs bg-background"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Passing Score Threshold
                </label>
                <Input
                  type="number"
                  min={1}
                  max={maxScore}
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="text-xs bg-background"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">
                Description & Rubric Notes (Optional)
              </label>
              <Textarea
                rows={2}
                placeholder="Overview of practical components, equipment requirements, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-background"
              />
            </div>
          </FieldGroup>

          <DialogFooter className="gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={
                createMutation.isPending || !title.trim() || !cohortId || !skillAreaId
              }
              className="text-xs gap-1.5"
            >
              {createMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {createMutation.isPending ? "Scheduling..." : "Create Assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
