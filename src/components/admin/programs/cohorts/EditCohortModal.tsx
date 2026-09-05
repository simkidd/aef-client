"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { Cohort, Program, TrainingCentre, SkillArea } from "@/interfaces";
import { useUpdateCohortMutation } from "@/hooks";
import { addCohortSchema, AddCohortFormData } from "./AddCohortModal";

interface EditCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohort: Cohort | null;
  programs?: Program[];
  centres?: TrainingCentre[];
  skillAreas?: SkillArea[];
}

export function EditCohortModal({
  isOpen,
  onClose,
  cohort,
  programs = [],
  centres = [],
  skillAreas = [],
}: EditCohortModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddCohortFormData>({
    resolver: zodResolver(addCohortSchema),
  });

  useEffect(() => {
    if (isOpen && cohort) {
      const progId =
        typeof cohort.programId === "string"
          ? cohort.programId
          : cohort.programId?._id || "";
      const ctrId =
        typeof cohort.centreId === "string"
          ? cohort.centreId
          : cohort.centreId?._id || "";
      const firstSkill = cohort.skillConfigs?.[0];
      const skillId =
        typeof firstSkill?.skillAreaId === "string"
          ? firstSkill.skillAreaId
          : firstSkill?.skillAreaId?._id || "";

      reset({
        name: cohort.name || "",
        cohortCode: cohort.cohortCode || "",
        programId: progId,
        centreId: ctrId,
        startDate: cohort.startDate
          ? new Date(cohort.startDate).toISOString().split("T")[0]
          : "",
        endDate: cohort.endDate
          ? new Date(cohort.endDate).toISOString().split("T")[0]
          : "",
        maxCapacity: cohort.maxCapacity || 40,
        status: (cohort.status?.toLowerCase() as any) || "upcoming",
        skillAreaId: skillId,
        startTime: firstSkill?.startTime || "09:00",
        endTime: firstSkill?.endTime || "12:00",
      });
    }
  }, [isOpen, cohort, reset]);

  const updateMutation = useUpdateCohortMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const onSubmit = (data: AddCohortFormData) => {
    if (!cohort?._id) return;

    const firstConfig = cohort.skillConfigs?.[0];
    const payload = {
      name: data.name,
      cohortCode: data.cohortCode || cohort.cohortCode,
      programId: data.programId,
      centreId: data.centreId,
      startDate: data.startDate,
      endDate: data.endDate,
      maxCapacity: data.maxCapacity,
      status: data.status,
      skillConfigs: [
        {
          ...(firstConfig || {}),
          skillAreaId:
            data.skillAreaId ||
            (typeof firstConfig?.skillAreaId === "string"
              ? firstConfig.skillAreaId
              : firstConfig?.skillAreaId?._id) ||
            skillAreas[0]?._id,
          startTime: data.startTime || firstConfig?.startTime || "09:00",
          endTime: data.endTime || firstConfig?.endTime || "12:00",
          daysOfWeek: firstConfig?.daysOfWeek || [1, 3, 5],
          durationWeeks: firstConfig?.durationWeeks || 8,
          maxCapacity: data.maxCapacity,
        },
      ],
    };

    updateMutation.mutate({
      id: cohort._id,
      data: payload as any,
    });
  };

  if (!cohort) return null;

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
      <DialogContent className="sm:max-w-2xl flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Edit Cohort Settings
          </DialogTitle>
          <DialogDescription>
            Update scheduling, location, and capacity rules for{" "}
            {cohort.cohortCode}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col"
        >
          <ScrollArea className="h-[380px] sm:h-[420px] py-2">
            <FieldGroup className="px-4 py-2">
              {/* Cohort Name */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Cohort Name *
                </FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="e.g. Lagos Solar PV Intensive Cohort 02 (Fall 2026)"
                  className="text-xs"
                />
                {errors.name && (
                  <FieldError className="text-xs">
                    {errors.name.message}
                  </FieldError>
                )}
              </Field>

              {/* Code & Max Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Cohort Code
                  </FieldLabel>
                  <Input
                    {...register("cohortCode")}
                    placeholder="e.g. COH-LAG-02"
                    className="text-xs font-mono"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Max Capacity (Seat Slots) *
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("maxCapacity")}
                    className="text-xs"
                  />
                  {errors.maxCapacity && (
                    <FieldError className="text-xs">
                      {errors.maxCapacity.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Parent Program & Training Centre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Parent Program *
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="programId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select program">
                            {programs.find((p) => p._id === field.value)?.title}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((p) => (
                            <SelectItem key={p._id} value={p._id}>
                              {p.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.programId && (
                    <FieldError className="text-xs">
                      {errors.programId.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Host Training Centre *
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="centreId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select centre">
                            {(() => {
                              const c = centres.find(
                                (ctr) => ctr._id === field.value,
                              );
                              return c ? `${c.name} (${c.state})` : undefined;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {centres.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name} ({c.state})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.centreId && (
                    <FieldError className="text-xs">
                      {errors.centreId.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Cohort Start Date *
                  </FieldLabel>
                  <Input
                    type="date"
                    {...register("startDate")}
                    className="text-xs"
                  />
                  {errors.startDate && (
                    <FieldError className="text-xs">
                      {errors.startDate.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Cohort End Date *
                  </FieldLabel>
                  <Input
                    type="date"
                    {...register("endDate")}
                    className="text-xs"
                  />
                  {errors.endDate && (
                    <FieldError className="text-xs">
                      {errors.endDate.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Primary Skill Discipline & Schedule Rules */}
              <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-3">
                <span className="text-xs font-semibold text-foreground block">
                  Primary Curriculum Track & Timetable Schedule
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field className="sm:col-span-1">
                    <FieldLabel className="text-[11px] font-medium">
                      Skill Discipline
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="skillAreaId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select skill">
                              {
                                skillAreas.find((s) => s._id === field.value)
                                  ?.name
                              }
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
                      )}
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-[11px] font-medium">
                      Daily Start Time
                    </FieldLabel>
                    <Input
                      type="time"
                      {...register("startTime")}
                      className="text-xs"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-[11px] font-medium">
                      Daily End Time
                    </FieldLabel>
                    <Input
                      type="time"
                      {...register("endTime")}
                      className="text-xs"
                    />
                  </Field>
                </div>
              </div>

              {/* Status */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Cohort Status *
                </FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select status">
                          {field.value === "upcoming"
                            ? "Upcoming"
                            : field.value === "in_progress"
                              ? "In Progress"
                              : field.value === "completed"
                                ? "Completed"
                                : field.value === "cancelled"
                                  ? "Cancelled"
                                  : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>
          </ScrollArea>

          <DialogFooter className="">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="font-semibold text-xs gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
