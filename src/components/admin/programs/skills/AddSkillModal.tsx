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
import { useCreateSkillAreaMutation } from "@/hooks";
import { toast } from "@/components/ui/toast";

export const addSkillSchema = z.object({
  name: z.string().min(2, "Skill name must be at least 2 characters"),
  code: z.string().min(2, "Skill code is required (e.g. SOL-PV)"),
  category: z.string().min(2, "Category is required"),
  defaultDurationWeeks: z.coerce
    .number()
    .min(1, "Duration must be at least 1 week"),
  certificationType: z.string().min(2, "Certification type is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  isActive: z.boolean(),
});

export type AddSkillFormData = z.infer<typeof addSkillSchema>;

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestedCode?: string;
}

export function AddSkillModal({
  isOpen,
  onClose,
  suggestedCode = "SKL-01",
}: AddSkillModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddSkillFormData>({
    resolver: zodResolver(addSkillSchema),
    defaultValues: {
      name: "",
      code: suggestedCode,
      category: "Renewable Energy",
      defaultDurationWeeks: 8,
      certificationType: "National Certification",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        code: suggestedCode,
        category: "Renewable Energy",
        defaultDurationWeeks: 8,
        certificationType: "National Certification",
        description: "",
        isActive: true,
      });
    }
  }, [isOpen, suggestedCode, reset]);

  const createMutation = useCreateSkillAreaMutation({
    onSuccess: (data) => {
      onClose();
      reset();
      toast.add({
        title: "Skill Track Created",
        description: `"${data?.name || "Skill"}" registered successfully.`,
        type: "success",
      });
    },
  });

  const onSubmit = (data: AddSkillFormData) => {
    createMutation.mutate(data);
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
      <DialogContent className="sm:max-w-lg flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Register New Skill Area
          </DialogTitle>
          <DialogDescription>
            Define a technical trade discipline available for cohort scheduling
            across multiple training centres.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col"
        >
          <ScrollArea className="h-[360px] sm:h-[400px] py-2">
            <FieldGroup className="px-2 py-2">
              {/* Skill Name */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Skill Name *
                </FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="e.g. Solar PV Installation & Maintenance"
                  className="text-xs"
                />
                {errors.name && (
                  <FieldError className="text-xs">
                    {errors.name.message}
                  </FieldError>
                )}
              </Field>

              {/* Code & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Discipline Code *
                  </FieldLabel>
                  <Input
                    {...register("code")}
                    placeholder="e.g. SOL-PV"
                    className="text-xs font-mono uppercase"
                  />
                  {errors.code && (
                    <FieldError className="text-xs">
                      {errors.code.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Standard Duration (Weeks) *
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("defaultDurationWeeks")}
                    placeholder="8"
                    className="text-xs"
                  />
                  {errors.defaultDurationWeeks && (
                    <FieldError className="text-xs">
                      {errors.defaultDurationWeeks.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Category & Certification Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Curriculum Category *
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Renewable Energy">
                            Renewable Energy
                          </SelectItem>
                          <SelectItem value="Technical / Vocational">
                            Technical / Vocational
                          </SelectItem>
                          <SelectItem value="Digital & ICT">
                            Digital & ICT
                          </SelectItem>
                          <SelectItem value="Creative Arts">
                            Creative Arts
                          </SelectItem>
                          <SelectItem value="Business & Entrepreneurship">
                            Business & Entrepreneurship
                          </SelectItem>
                          <SelectItem value="Agriculture">
                            Agriculture & Agro-Tech
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <FieldError className="text-xs">
                      {errors.category.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Certification Standard *
                  </FieldLabel>
                  <Input
                    {...register("certificationType")}
                    placeholder="e.g. National Certification"
                    className="text-xs"
                  />
                  {errors.certificationType && (
                    <FieldError className="text-xs">
                      {errors.certificationType.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Description */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Syllabus & Competency Description *
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Outline practical competencies, toolsets, and core syllabus modules taught..."
                  className="text-xs"
                />
                {errors.description && (
                  <FieldError className="text-xs">
                    {errors.description.message}
                  </FieldError>
                )}
              </Field>

              {/* Active Switch */}
              <div className="pt-1">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="font-medium text-foreground">
                        Active & Available for Program Cohorts
                      </span>
                    </label>
                  )}
                />
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
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Skill Area"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
