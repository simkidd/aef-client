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
  FieldSet,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { TrainingCentre } from "@/interfaces";
import { useCreateStaffMutation } from "@/hooks";

export const addStaffSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  position: z.string().min(2, "Job title is required"),
  assignedCentreId: z.string().optional(),
});

export type AddStaffFormData = z.infer<typeof addStaffSchema>;

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  centres: TrainingCentre[];
}

export function AddStaffModal({
  isOpen,
  onClose,
  centres,
}: AddStaffModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddStaffFormData>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      email: "",
      phone: "",
      position: "",
      assignedCentreId: centres?.[0]?._id || "",
    },
  });

  useEffect(() => {
    if (centres?.length > 0) {
      setValue("assignedCentreId", centres[0]._id);
    }
  }, [centres, setValue]);

  const createStaffMutation = useCreateStaffMutation({
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  const onSubmit = (data: AddStaffFormData) => {
    createStaffMutation.mutate({
      ...data,
      assignedCentreId: data.assignedCentreId || centres?.[0]?._id,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Add New Staff Record
          </DialogTitle>
          <DialogDescription>
            Create a new employee record in the organizational HR database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldSet>
            <FieldGroup className="gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel
                    htmlFor="firstName"
                    className="text-xs font-semibold text-foreground"
                  >
                    First Name *
                  </FieldLabel>
                  <Input
                    id="firstName"
                    placeholder="e.g. Amina"
                    {...register("firstName")}
                  />
                  <FieldError>{errors.firstName?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="lastName"
                    className="text-xs font-semibold text-foreground"
                  >
                    Last Name *
                  </FieldLabel>
                  <Input
                    id="lastName"
                    placeholder="e.g. Bello"
                    {...register("lastName")}
                  />
                  <FieldError>{errors.lastName?.message}</FieldError>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-xs font-semibold text-foreground"
                  >
                    Email Address *
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="amina@adelefoundation.org"
                    {...register("email")}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="phone"
                    className="text-xs font-semibold text-foreground"
                  >
                    Phone Number *
                  </FieldLabel>
                  <Input
                    id="phone"
                    placeholder="+234 810 000 0000"
                    {...register("phone")}
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel
                    htmlFor="position"
                    className="text-xs font-semibold text-foreground"
                  >
                    Position / Job Title *
                  </FieldLabel>
                  <Input
                    id="position"
                    placeholder="e.g. Lead Trainer"
                    {...register("position")}
                  />
                  <FieldError>{errors.position?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="gender"
                    className="text-xs font-semibold text-foreground"
                  >
                    Gender *
                  </FieldLabel>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => {
                      const genderLabels: Record<string, string> = {
                        male: "Male",
                        female: "Female",
                        other: "Other",
                      };
                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="gender" className="w-full">
                            <SelectValue placeholder="Select Gender">
                              {genderLabels[field.value] || field.value}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <FieldError>{errors.gender?.message}</FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="centre"
                  className="text-xs font-semibold text-foreground"
                >
                  Assigned Centre
                </FieldLabel>
                <Controller
                  name="assignedCentreId"
                  control={control}
                  render={({ field }) => {
                    const selectedCentreId = field.value || centres?.[0]?._id;
                    const selectedCentre = centres?.find(
                      (c) => c._id === selectedCentreId,
                    );
                    return (
                      <Select
                        value={selectedCentreId || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="centre" className="w-full">
                          <SelectValue placeholder="Select Centre">
                            {selectedCentre?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {centres?.map((centre) => (
                            <SelectItem key={centre._id} value={centre._id}>
                              {centre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                <FieldError>{errors.assignedCentreId?.message}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={createStaffMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createStaffMutation.isPending}
              className="gap-2"
            >
              {createStaffMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Staff Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
