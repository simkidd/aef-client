"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Building,
  Layers,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Program, SkillArea, TrainingCentre } from "@/interfaces";

export default function PortalProgramsPage() {
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [selectedCentreId, setSelectedCentreId] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applySuccess, setApplySuccess] = useState<boolean>(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Fetch published programs
  const { data: programs, isLoading } = useQuery({
    queryKey: ["portal-programs"],
    queryFn: async () => {
      const res = await api.get("/programs/published");
      return res.data?.data as Program[];
    },
  });

  // Fetch training centres for selection
  const { data: centres } = useQuery({
    queryKey: ["portal-centres"],
    queryFn: async () => {
      const res = await api.get("/centres");
      return res.data?.data as TrainingCentre[];
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/applications/apply", payload);
      return res.data;
    },
    onSuccess: () => {
      setApplySuccess(true);
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (err: any) => {
      setApplyError(
        err.response?.data?.message || "Failed to submit application.",
      );
    },
  });

  const handleOpenApply = (prog: Program) => {
    setSelectedProgram(prog);
    setSelectedSkillId(prog.skillAreaIds?.[0]?._id || "");
    setSelectedCentreId(centres?.[0]?._id || "");
    setStatement("");
    setExperience("");
    setApplySuccess(false);
    setApplyError(null);
    setIsApplyModalOpen(true);
  };

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !selectedSkillId) return;

    applyMutation.mutate({
      programId: selectedProgram._id,
      preferredSkillAreaId: selectedSkillId,
      preferredCentreId: selectedCentreId || undefined,
      statementOfPurpose: statement,
      previousExperience: experience,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Empowerment Programs & Technical Trainings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse available opportunities organized by Adele Empowerment
            Foundation and government/partner initiatives.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wider">
              Loading programs...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs?.map((prog) => (
              <Card
                key={prog._id}
                className="flex flex-col justify-between hover:shadow-md transition-all border-slate-200 dark:border-slate-800"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 dark:bg-primary/15 dark:text-primary">
                      {prog.organizerType}
                    </span>
                    <StatusBadge status={prog.status} size="sm" />
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                    {prog.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Organizer: <strong>{prog.organizerName}</strong> • Delivery
                    Role: {prog.deliveryRole}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-xs">
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-3">
                    {prog.description}
                  </p>

                  {/* Skill Areas */}
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Available Skill Tracks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.skillAreaIds?.map((skill: any) => (
                        <span
                          key={skill._id}
                          className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium dark:bg-slate-800 dark:text-slate-200"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Program Meta */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Application Deadline
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(prog.applicationDeadline)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Slots
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {prog.maxSlots || "100"} Seats
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleOpenApply(prog)}
                    className="w-full font-semibold"
                  >
                    Apply for this Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Online Application Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit Application</DialogTitle>
              <DialogDescription>
                Apply for <strong>{selectedProgram?.title}</strong>
              </DialogDescription>
            </DialogHeader>

            {applySuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your application has been received and added to the review
                  queue. You can track status under "My Applications".
                </p>
                <Button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="mt-4"
                >
                  View My Applications
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleConfirmApply}
                className="space-y-4 py-2 text-xs"
              >
                {applyError && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-800">
                    {applyError}
                  </div>
                )}

                <FieldGroup>
                  {/* Preferred Skill Track */}
                  <Field>
                    <FieldLabel htmlFor="skillTrack">
                      Preferred Skill Track *
                    </FieldLabel>
                    <select
                      id="skillTrack"
                      value={selectedSkillId}
                      onChange={(e) => setSelectedSkillId(e.target.value)}
                      required
                      className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {selectedProgram?.skillAreaIds?.map((skill: any) => (
                        <option key={skill._id} value={skill._id}>
                          {skill.name} ({skill.category})
                        </option>
                      ))}
                    </select>
                    <FieldDescription>
                      Choose your specialized vocational or digital trade track
                    </FieldDescription>
                  </Field>

                  {/* Preferred Training Centre */}
                  <Field>
                    <FieldLabel htmlFor="trainingCentre">
                      Preferred Training Centre *
                    </FieldLabel>
                    <select
                      id="trainingCentre"
                      value={selectedCentreId}
                      onChange={(e) => setSelectedCentreId(e.target.value)}
                      required
                      className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {centres?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                    <FieldDescription>
                      Physical location for practical workshops & biometric
                      attendance
                    </FieldDescription>
                  </Field>

                  {/* Statement of purpose */}
                  <Field>
                    <FieldLabel htmlFor="statement">
                      Statement of Purpose
                    </FieldLabel>
                    <Textarea
                      id="statement"
                      rows={3}
                      placeholder="Why are you interested in this technical empowerment track?"
                      value={statement}
                      onChange={(e) => setStatement(e.target.value)}
                      className="text-xs"
                    />
                  </Field>
                </FieldGroup>

                <DialogFooter className="gap-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending
                      ? "Submitting..."
                      : "Submit Application"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
