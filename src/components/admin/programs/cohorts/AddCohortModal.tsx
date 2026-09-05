"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Program, TrainingCentre, SkillArea } from "@/interfaces";
import { useCreateCohortMutation } from "@/hooks";

export const addCohortSchema = z.object({
  name: z.string().min(3, "Cohort name must be at least 3 characters"),
  cohortCode: z.string().optional(),
  programId: z.string().min(1, "Please select a parent program"),
  centreId: z.string().min(1, "Please select a training centre"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxCapacity: z.coerce.number().min(1, "Capacity must be at least 1 seat"),
  status: z.enum(["upcoming", "in_progress", "completed", "cancelled"]),
  skillAreaId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export type AddCohortFormData = z.infer<typeof addCohortSchema>;

interface AddCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs?: Program[];
  centres?: TrainingCentre[];
  skillAreas?: SkillArea[];
  suggestedCode?: string;
}

export function AddCohortModal({
  isOpen,
  onClose,
  programs = [],
  centres = [],
  skillAreas = [],
  suggestedCode = "COH-LAG-01",
}: AddCohortModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddCohortFormData>({
    resolver: zodResolver(addCohortSchema),
    defaultValues: {
      name: "",
      cohortCode: suggestedCode,
      programId: "",
      centreId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      maxCapacity: 40,
      status: "upcoming",
      skillAreaId: "",
      startTime: "09:00",
      endTime: "12:00",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        cohortCode: suggestedCode,
        programId: programs[0]?._id || "",
        centreId: centres[0]?._id || "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        maxCapacity: 40,
        status: "upcoming",
        skillAreaId: skillAreas[0]?._id || "",
        startTime: "09:00",
        endTime: "12:00",
      });
    }
  }, [isOpen, suggestedCode, reset, programs, centres, skillAreas]);

  const createMutation = useCreateCohortMutation({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const onSubmit = (data: AddCohortFormData) => {
    const payload = {
      name: data.name,
      cohortCode: data.cohortCode || suggestedCode,
      programId: data.programId,
      centreId: data.centreId,
      startDate: data.startDate,
      endDate: data.endDate,
      maxCapacity: data.maxCapacity,
      status: data.status,
      skillConfigs: [
        {
          skillAreaId: data.skillAreaId || skillAreas[0]?._id,
          startTime: data.startTime || "09:00",
          endTime: data.endTime || "12:00",
          daysOfWeek: [1, 3, 5],
          durationWeeks: 8,
          maxCapacity: data.maxCapacity,
        },
      ],
    };

    createMutation.mutate(payload as any);
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
      <DialogContent className="sm:max-w-xl flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Create Training Cohort & Slot Schedule
          </DialogTitle>
          <DialogDescription>
            Schedule a new training batch at an accredited centre, bind
            timetable rules, and auto-generate practical sessions.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col overflow-hidden"
        >
          <ScrollArea className="h-[380px] sm:h-[420px] py-2">
            <FieldGroup className="px-6 py-2 space-y-4">
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
                    placeholder="40"
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
                          <SelectValue placeholder="Select program" />
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
                          <SelectValue placeholder="Select centre" />
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
                            <SelectValue placeholder="Select skill" />
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

              {/* Initial Status */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Cohort Status *
                </FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="in_progress">
                          In Progress
                        </SelectItem>
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
              disabled={createMutation.isPending}
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Create & Schedule Cohort"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
