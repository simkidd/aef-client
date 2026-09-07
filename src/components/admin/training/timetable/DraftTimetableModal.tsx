"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Clock,
  Layers,
  Loader2,
  CheckCircle2,
  Send,
  Save,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Square,
} from "lucide-react";
import { Cohort, SkillArea, TrainingCentre, TimetableSlot } from "@/interfaces";
import { useSaveTimetableDraftMutation } from "@/hooks";

const DEFAULT_DAYS = [1, 2, 3, 4, 5]; // Mon - Fri

const DAY_LABELS = [
  { day: 1, label: "Mon" },
  { day: 2, label: "Tue" },
  { day: 3, label: "Wed" },
  { day: 4, label: "Thu" },
  { day: 5, label: "Fri" },
  { day: 6, label: "Sat" },
];

export const timetableSlotSchema = z.object({
  slotNumber: z.number(),
  slotName: z.string().min(1, "Slot name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  daysOfWeek: z.array(z.number()).min(1, "Select at least 1 day of the week"),
  skillAreaIds: z.array(z.string()),
  roomId: z.string().optional(),
});

export const draftTimetableSchema = z.object({
  cohortId: z.string().min(1, "Please select a training cohort"),
  slots: z.array(timetableSlotSchema).min(1, "At least 1 slot is required"),
});

export type DraftTimetableFormData = z.infer<typeof draftTimetableSchema>;

interface DraftTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohorts: Cohort[];
  skillAreas: SkillArea[];
  centres: TrainingCentre[];
  defaultCohortId?: string;
}

function calculateSlotDuration(
  start: string,
  end: string,
): { text: string; isValid: boolean } {
  if (!start || !end) return { text: "—", isValid: true };
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  const startMins = sH * 60 + (sM || 0);
  const endMins = eH * 60 + (eM || 0);
  const diff = endMins - startMins;
  if (diff <= 0) {
    return { text: "End must be after start", isValid: false };
  }
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  const formatted =
    `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m` : ""}`.trim() || `${diff}m`;
  return { text: formatted, isValid: true };
}

export function DraftTimetableModal({
  isOpen,
  onClose,
  cohorts,
  skillAreas,
  centres,
  defaultCohortId,
}: DraftTimetableModalProps) {
  const [hasSlot3, setHasSlot3] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DraftTimetableFormData>({
    resolver: zodResolver(draftTimetableSchema),
    defaultValues: {
      cohortId: defaultCohortId || cohorts[0]?._id || "",
      slots: [
        {
          slotNumber: 1,
          slotName: "Morning Session",
          startTime: "08:30",
          endTime: "11:30",
          daysOfWeek: DEFAULT_DAYS,
          skillAreaIds: [],
        },
        {
          slotNumber: 2,
          slotName: "Afternoon Session",
          startTime: "12:00",
          endTime: "15:00",
          daysOfWeek: DEFAULT_DAYS,
          skillAreaIds: [],
        },
      ],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "slots",
  });

  const watchedCohortId = watch("cohortId");
  const watchedSlots = watch("slots") || [];

  const saveMutation = useSaveTimetableDraftMutation({
    onSuccess: () => {
      onClose();
    },
  });

  // Selected cohort object
  const selectedCohort = useMemo(
    () => cohorts.find((c) => c._id === watchedCohortId),
    [cohorts, watchedCohortId],
  );

  // Available skills in the selected cohort or global
  const cohortAvailableSkills = useMemo(() => {
    if (!selectedCohort || !selectedCohort.skillConfigs?.length) {
      return skillAreas;
    }
    const cohortSkillIds = new Set(
      selectedCohort.skillConfigs.map((sc) =>
        sc.skillAreaId?._id ? sc.skillAreaId._id : sc.skillAreaId,
      ),
    );
    const filtered = skillAreas.filter((s) => cohortSkillIds.has(s._id));
    return filtered.length > 0 ? filtered : skillAreas;
  }, [selectedCohort, skillAreas]);

  // Sync cohort selection on open
  useEffect(() => {
    if (isOpen) {
      const initialId = defaultCohortId || cohorts[0]?._id || "";
      setValue("cohortId", initialId);
    }
  }, [isOpen, defaultCohortId, cohorts, setValue]);

  // Load existing slots when cohort changes
  useEffect(() => {
    if (selectedCohort) {
      if (
        selectedCohort.timetableSlots &&
        selectedCohort.timetableSlots.length > 0
      ) {
        replace(selectedCohort.timetableSlots);
        setHasSlot3(
          selectedCohort.timetableSlots.some((s) => s.slotNumber === 3),
        );
      } else {
        const allSkillIds = cohortAvailableSkills.map((s) => s._id);
        const mid = Math.ceil(allSkillIds.length / 2);
        const slot1Skills = allSkillIds.slice(0, mid);
        const slot2Skills = allSkillIds.slice(mid);

        replace([
          {
            slotNumber: 1,
            slotName: "Morning Session",
            startTime: "08:30",
            endTime: "11:30",
            daysOfWeek: DEFAULT_DAYS,
            skillAreaIds: slot1Skills,
          },
          {
            slotNumber: 2,
            slotName: "Afternoon Session",
            startTime: "12:00",
            endTime: "15:00",
            daysOfWeek: DEFAULT_DAYS,
            skillAreaIds: slot2Skills,
          },
        ]);
        setHasSlot3(false);
      }
    }
  }, [watchedCohortId, selectedCohort, cohortAvailableSkills, replace]);

  // Quick Preset Handlers
  const applyStandard2SlotPreset = () => {
    const allSkillIds = cohortAvailableSkills.map((s) => s._id);
    const mid = Math.ceil(allSkillIds.length / 2);
    replace([
      {
        slotNumber: 1,
        slotName: "Morning Session",
        startTime: "08:30",
        endTime: "11:30",
        daysOfWeek: DEFAULT_DAYS,
        skillAreaIds: allSkillIds.slice(0, mid),
      },
      {
        slotNumber: 2,
        slotName: "Afternoon Session",
        startTime: "12:00",
        endTime: "15:00",
        daysOfWeek: DEFAULT_DAYS,
        skillAreaIds: allSkillIds.slice(mid),
      },
    ]);
    setHasSlot3(false);
  };

  const applyIntensive3SlotPreset = () => {
    const allSkillIds = cohortAvailableSkills.map((s) => s._id);
    const chunk = Math.ceil(allSkillIds.length / 3) || 1;
    replace([
      {
        slotNumber: 1,
        slotName: "Morning Session",
        startTime: "08:30",
        endTime: "11:00",
        daysOfWeek: DEFAULT_DAYS,
        skillAreaIds: allSkillIds.slice(0, chunk),
      },
      {
        slotNumber: 2,
        slotName: "Midday Session",
        startTime: "11:30",
        endTime: "14:00",
        daysOfWeek: DEFAULT_DAYS,
        skillAreaIds: allSkillIds.slice(chunk, chunk * 2),
      },
      {
        slotNumber: 3,
        slotName: "Late Afternoon Session",
        startTime: "14:30",
        endTime: "17:00",
        daysOfWeek: DEFAULT_DAYS,
        skillAreaIds: allSkillIds.slice(chunk * 2),
      },
    ]);
    setHasSlot3(true);
  };

  // Toggle Slot 3
  const handleToggleSlot3 = (enabled: boolean) => {
    setHasSlot3(enabled);
    const currentSlots = watchedSlots;
    if (enabled) {
      if (!currentSlots.some((s) => s.slotNumber === 3)) {
        replace([
          ...currentSlots,
          {
            slotNumber: 3,
            slotName: "Late Afternoon Session",
            startTime: "15:30",
            endTime: "17:30",
            daysOfWeek: DEFAULT_DAYS,
            skillAreaIds: [],
          },
        ]);
      }
    } else {
      replace(currentSlots.filter((s) => s.slotNumber !== 3));
    }
  };

  // Skill Selection Helpers
  const handleToggleSkill = (slotIndex: number, skillId: string) => {
    const currentSkills = watchedSlots[slotIndex]?.skillAreaIds || [];
    const exists = currentSkills.includes(skillId);
    const newSkills = exists
      ? currentSkills.filter((id) => id !== skillId)
      : [...currentSkills, skillId];
    setValue(`slots.${slotIndex}.skillAreaIds`, newSkills);
  };

  const handleSelectAllSkills = (slotIndex: number) => {
    const allIds = cohortAvailableSkills.map((s) => s._id);
    setValue(`slots.${slotIndex}.skillAreaIds`, allIds);
  };

  const handleClearAllSkills = (slotIndex: number) => {
    setValue(`slots.${slotIndex}.skillAreaIds`, []);
  };

  const handleToggleDay = (slotIndex: number, day: number) => {
    const currentDays = watchedSlots[slotIndex]?.daysOfWeek || [];
    const exists = currentDays.includes(day);
    const newDays = exists
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();
    setValue(`slots.${slotIndex}.daysOfWeek`, newDays);
  };

  // Form Submit
  const onFormSubmit = (
    data: DraftTimetableFormData,
    publishImmediately: boolean,
  ) => {
    saveMutation.mutate({
      id: data.cohortId,
      data: {
        slots: data.slots,
        publishImmediately,
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
      <DialogContent className="w-[96vw] sm:max-w-3xl h-[92dvh] sm:h-[88vh] max-h-[92dvh] sm:max-h-[88vh] flex flex-col p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-3.5 sm:p-6 pb-2.5 sm:pb-4 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Layers className="h-4 w-4 shrink-0" />
            <span>Timetable Drafter & Slot Builder</span>
          </div>
          <DialogTitle className="text-base sm:text-xl font-bold font-heading text-foreground mt-0.5">
            Draft Cohort Timetable
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-none">
            Configure 2 to 3 session slots per day, set precise class start
            times, and assign skill tracks. Trainees will see the timetable on their portal once published.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 sm:p-6 space-y-3.5 sm:space-y-6">
              {/* Cohort Selector & Quick Presets */}
              <div className="bg-card p-3 sm:p-4.5 rounded-xl border border-border space-y-3 sm:space-y-4 shadow-2xs">
                <Controller
                  control={control}
                  name="cohortId"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-xs font-semibold text-foreground">
                        Target Training Cohort
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val || "")}
                      >
                        <SelectTrigger className="w-full h-9 text-xs">
                          <SelectValue placeholder="Select a cohort to draft timetable...">
                            {selectedCohort
                              ? `${selectedCohort.name} (${selectedCohort.cohortCode})`
                              : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                          {cohorts.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name} ({c.cohortCode}) •{" "}
                              <span className="capitalize text-muted-foreground">
                                {c.timetableStatus === "published"
                                  ? "Published"
                                  : "Draft"}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.cohortId && (
                        <FieldError>{errors.cohortId.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Quick Template Presets */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    Quick Presets:
                  </span>
                  <div className="grid grid-cols-1 sm:flex items-center gap-1.5 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyStandard2SlotPreset}
                      className="h-7.5 sm:h-7 text-[11px] px-2.5 bg-muted/30 w-full sm:w-auto justify-center"
                    >
                      Standard 2-Slot (Morning + Afternoon)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyIntensive3SlotPreset}
                      className="h-7.5 sm:h-7 text-[11px] px-2.5 bg-muted/30 w-full sm:w-auto justify-center"
                    >
                      Intensive 3-Slot
                    </Button>
                  </div>
                </div>
              </div>

              {/* Slot Cards List */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    Daily Session Slots ({watchedSlots.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">
                      Enable 3rd Slot
                    </span>
                    <Switch
                      checked={hasSlot3}
                      onCheckedChange={handleToggleSlot3}
                    />
                  </div>
                </div>

                {watchedSlots.map((slot, index) => {
                  const durationInfo = calculateSlotDuration(
                    slot.startTime,
                    slot.endTime,
                  );
                  return (
                    <div
                      key={slot.slotNumber}
                      className="bg-card border border-border rounded-xl p-3 sm:p-4.5 space-y-3 sm:space-y-4 shadow-2xs hover:border-primary/40 transition-colors"
                    >
                      {/* Slot Header & Times */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                              {slot.slotNumber}
                            </span>
                            <Controller
                              control={control}
                              name={`slots.${index}.slotName`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  className="h-8 text-xs font-semibold flex-1 sm:w-48 border-transparent hover:border-border focus:border-primary"
                                  placeholder="Slot Name (e.g. Morning)"
                                />
                              )}
                            />
                          </div>

                          {durationInfo.isValid ? (
                            <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full shrink-0">
                              {durationInfo.text}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-destructive/15 text-destructive rounded-full shrink-0">
                              {durationInfo.text}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:flex items-center gap-2 text-xs w-full sm:w-auto">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                            <span className="text-muted-foreground font-medium text-[10px] sm:text-[11px]">
                              Start:
                            </span>
                            <Controller
                              control={control}
                              name={`slots.${index}.startTime`}
                              render={({ field }) => (
                                <TimePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  align="start"
                                  className="w-full sm:w-28"
                                />
                              )}
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                            <span className="text-muted-foreground font-medium text-[10px] sm:text-[11px]">
                              End:
                            </span>
                            <Controller
                              control={control}
                              name={`slots.${index}.endTime`}
                              render={({ field }) => (
                                <TimePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  align="end"
                                  className="w-full sm:w-28"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Days of Week Selection */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block uppercase tracking-wider">
                          Scheduled Days of Week
                        </span>
                        <div className="grid grid-cols-6 sm:flex sm:flex-wrap gap-1 sm:gap-1.5">
                          {DAY_LABELS.map(({ day, label }) => {
                            const isSelected = slot.daysOfWeek?.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() =>
                                  handleToggleDay(index, day)
                                }
                                className={`text-xs py-1.5 sm:py-1 px-1 sm:px-2.5 rounded-lg font-medium transition-all text-center ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skill Tracks Selection */}
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Assigned Skills ({slot.skillAreaIds?.length || 0} selected)
                          </span>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectAllSkills(index)
                              }
                              className="text-[10px] text-primary hover:underline font-medium flex items-center gap-1"
                            >
                              <CheckSquare className="h-3 w-3" /> Select All
                            </button>
                            <span className="text-muted-foreground/40">•</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleClearAllSkills(index)
                              }
                              className="text-[10px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
                            >
                              <Square className="h-3 w-3" /> Clear
                            </button>
                          </div>
                        </div>

                        <ScrollArea className="max-h-44 rounded-lg border border-border/60 p-2 bg-muted/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                            {cohortAvailableSkills.map((skill) => {
                              const isChecked = slot.skillAreaIds?.includes(
                                skill._id,
                              );
                              return (
                                <button
                                  key={skill._id}
                                  type="button"
                                  onClick={() =>
                                    handleToggleSkill(index, skill._id)
                                  }
                                  className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border text-left text-xs transition-all ${
                                    isChecked
                                      ? "border-primary/50 bg-primary/5 text-foreground font-semibold shadow-2xs"
                                      : "border-border/70 bg-card hover:bg-muted/40 text-muted-foreground"
                                  }`}
                                >
                                  <div className="truncate pr-2">
                                    <span className="block truncate font-medium">
                                      {skill.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                      {skill.code}
                                    </span>
                                  </div>
                                  <div
                                    className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                                      isChecked
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-muted-foreground/40 bg-background"
                                    }`}
                                  >
                                    {isChecked && (
                                      <CheckCircle2 className="h-3 w-3" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="m-0 p-3 sm:p-4 border-t border-border bg-muted/20 shrink-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={saveMutation.isPending}
              className="text-xs w-full sm:w-auto h-9 sm:h-8"
            >
              Cancel
            </Button>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSubmit((data) => onFormSubmit(data, false))}
                disabled={saveMutation.isPending || !watchedCohortId}
                className="text-xs h-9 sm:h-8 w-full sm:w-auto justify-center"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                Save Draft
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleSubmit((data) => onFormSubmit(data, true))}
                disabled={saveMutation.isPending || !watchedCohortId}
                className="text-xs h-9 sm:h-8 w-full sm:w-auto justify-center font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Save & Publish
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
