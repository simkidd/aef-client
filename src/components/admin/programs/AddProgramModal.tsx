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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
import { SkillArea } from "@/interfaces";
import { useCreateProgramMutation } from "@/hooks";

export const addProgramSchema = z.object({
  title: z.string().min(3, "Program title must be at least 3 characters"),
  code: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  organizerType: z.enum([
    "Adele Owned",
    "Government Owned",
    "NGO Partner",
    "Private Sector",
  ]),
  organizerName: z.string().min(2, "Organizer name is required"),
  deliveryRole: z.string().min(2, "Delivery role is required"),
  status: z.enum(["active", "draft", "archived", "completed", "cancelled"]),
  skillAreaIds: z.array(z.string()).min(1, "Select at least one skill area"),
  maxSlots: z.coerce.number().min(1, "Max slots must be at least 1"),
  applicationStartDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  published: z.boolean(),
  isFeatured: z.boolean(),
});

export type AddProgramFormData = z.infer<typeof addProgramSchema>;

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillAreas?: SkillArea[];
  suggestedCode?: string;
}

export function AddProgramModal({
  isOpen,
  onClose,
  skillAreas = [],
  suggestedCode = "PROG-2026-01",
}: AddProgramModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddProgramFormData>({
    resolver: zodResolver(addProgramSchema),
    defaultValues: {
      title: "",
      code: suggestedCode,
      description: "",
      organizerType: "Adele Owned",
      organizerName: "Adele Empowerment Foundation",
      deliveryRole: "Primary Host",
      status: "active",
      skillAreaIds: [],
      maxSlots: 100,
      applicationStartDate: new Date().toISOString().split("T")[0],
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      published: true,
      isFeatured: false,
    },
  });

  const selectedSkills = watch("skillAreaIds") || [];

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        code: suggestedCode,
        description: "",
        organizerType: "Adele Owned",
        organizerName: "Adele Empowerment Foundation",
        deliveryRole: "Primary Host",
        status: "active",
        skillAreaIds: skillAreas.length > 0 ? [skillAreas[0]._id] : [],
        maxSlots: 100,
        applicationStartDate: new Date().toISOString().split("T")[0],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        published: true,
        isFeatured: false,
      });
    }
  }, [isOpen, suggestedCode, reset, skillAreas]);

  const createMutation = useCreateProgramMutation({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const onSubmit = (data: AddProgramFormData) => {
    createMutation.mutate({
      ...data,
      code: data.code || suggestedCode,
    });
  };

  const toggleSkill = (id: string) => {
    if (selectedSkills.includes(id)) {
      setValue(
        "skillAreaIds",
        selectedSkills.filter((s) => s !== id),
        { shouldValidate: true }
      );
    } else {
      setValue("skillAreaIds", [...selectedSkills, id], {
        shouldValidate: true,
      });
    }
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
            Create Program / Initiative
          </DialogTitle>
          <DialogDescription>
            Register a technical training track, government partnership, or
            sponsored vocational initiative.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col"
        >
          <ScrollArea className="h-[380px] sm:h-[420px] py-2">
            <FieldGroup className="px-6 py-2">
              {/* Title */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Program Title *
                </FieldLabel>
                <Input
                  {...register("title")}
                  placeholder="e.g. National Renewable Energy & Solar PV Initiative"
                  className="text-xs"
                />
                {errors.title && (
                  <FieldError className="text-xs">
                    {errors.title.message}
                  </FieldError>
                )}
              </Field>

              {/* Code & Delivery Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Program Code
                  </FieldLabel>
                  <Input
                    {...register("code")}
                    placeholder="e.g. AEF-SOLAR-2026"
                    className="text-xs font-mono"
                  />
                  {errors.code && (
                    <FieldError className="text-xs">
                      {errors.code.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Delivery Role *
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="deliveryRole"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select delivery role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Primary Host">
                            Primary Host
                          </SelectItem>
                          <SelectItem value="Co-host">Co-host</SelectItem>
                          <SelectItem value="Accredited Facilitator">
                            Accredited Facilitator
                          </SelectItem>
                          <SelectItem value="Partner Funded">
                            Partner Funded
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.deliveryRole && (
                    <FieldError className="text-xs">
                      {errors.deliveryRole.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Organizer Type & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Organizer Type *
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="organizerType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Adele Owned">
                            Adele Owned
                          </SelectItem>
                          <SelectItem value="Government Owned">
                            Government Owned
                          </SelectItem>
                          <SelectItem value="NGO Partner">
                            NGO Partner
                          </SelectItem>
                          <SelectItem value="Private Sector">
                            Private Sector
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.organizerType && (
                    <FieldError className="text-xs">
                      {errors.organizerType.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Organizer / Sponsor Name *
                  </FieldLabel>
                  <Input
                    {...register("organizerName")}
                    placeholder="e.g. Federal Ministry of Labour"
                    className="text-xs"
                  />
                  {errors.organizerName && (
                    <FieldError className="text-xs">
                      {errors.organizerName.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Skill Areas Selector using Checkbox UI */}
              <Field>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel className="text-xs font-semibold">
                    Integrated Skill Areas *
                  </FieldLabel>
                  <span className="text-[11px] text-muted-foreground">
                    {selectedSkills.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg border border-border bg-muted/20">
                  {skillAreas.map((skill) => {
                    const isChecked = selectedSkills.includes(skill._id);
                    return (
                      <div
                        key={skill._id}
                        onClick={() => toggleSkill(skill._id)}
                        className={`flex items-center gap-2.5 p-2 rounded-md cursor-pointer text-xs transition-colors border select-none ${
                          isChecked
                            ? "bg-primary/10 border-primary/20 text-primary dark:bg-primary/15 dark:border-primary/20 dark:text-primary font-medium"
                            : "bg-background border-border text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSkill(skill._id)}
                        />
                        <div className="truncate">
                          <span className="block truncate">{skill.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {skill.code}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.skillAreaIds && (
                  <FieldError className="text-xs">
                    {errors.skillAreaIds.message}
                  </FieldError>
                )}
              </Field>

              {/* Slots and Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Max Slots *
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("maxSlots")}
                    placeholder="100"
                    className="text-xs"
                  />
                  {errors.maxSlots && (
                    <FieldError className="text-xs">
                      {errors.maxSlots.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Application Start
                  </FieldLabel>
                  <Input
                    type="date"
                    {...register("applicationStartDate")}
                    className="text-xs"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Deadline
                  </FieldLabel>
                  <Input
                    type="date"
                    {...register("applicationDeadline")}
                    className="text-xs"
                  />
                </Field>
              </div>

              {/* Description */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Program Description *
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Outline program objectives, target beneficiaries, and expected outcomes..."
                  className="text-xs"
                />
                {errors.description && (
                  <FieldError className="text-xs">
                    {errors.description.message}
                  </FieldError>
                )}
              </Field>

              {/* Status & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Initial Status *
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <div className="flex items-center gap-6 h-9">
                  <Controller
                    control={control}
                    name="published"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="font-medium text-foreground">
                          Published
                        </span>
                      </label>
                    )}
                  />

                  <Controller
                    control={control}
                    name="isFeatured"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="font-medium text-foreground">
                          Featured
                        </span>
                      </label>
                    )}
                  />
                </div>
              </div>
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
              className="font-semibold text-xs gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Program"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
