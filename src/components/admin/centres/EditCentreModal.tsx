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
import { Staff, TrainingCentre } from "@/interfaces";
import { useUpdateCentreMutation } from "@/hooks";
import { toast } from "@/components/ui/toast";

export const editCentreSchema = z.object({
  name: z.string().min(3, "Centre name must be at least 3 characters"),
  state: z.string().min(2, "State is required"),
  lga: z.string().min(2, "LGA / District is required"),
  address: z.string().min(5, "Physical street address is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(7, "Please enter a valid contact phone number"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1 seat"),
  status: z.enum(["active", "inactive", "under_maintenance"]),
  centreManagerId: z.string().optional(),
});

export type EditCentreFormData = z.infer<typeof editCentreSchema>;

interface EditCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  centre: TrainingCentre | null;
  staffList?: Staff[];
}

export function EditCentreModal({
  isOpen,
  onClose,
  centre,
  staffList = [],
}: EditCentreModalProps) {
  const updateCentreMutation = useUpdateCentreMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditCentreFormData>({
    resolver: zodResolver(editCentreSchema) as any,
    defaultValues: {
      name: "",
      state: "",
      lga: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      capacity: 100,
      status: "active",
      centreManagerId: "",
    },
  });

  const selectedStatus = watch("status");
  const selectedManagerId = watch("centreManagerId");

  useEffect(() => {
    if (isOpen && centre) {
      reset({
        name: centre.name || "",
        state: centre.state || "",
        lga: centre.lga || "",
        address: centre.address || "",
        contactEmail: centre.contactEmail || "",
        contactPhone: centre.contactPhone || "",
        capacity: centre.capacity || 100,
        status: (centre.status as any) || "active",
        centreManagerId:
          typeof centre.centreManagerId === "object"
            ? (centre.centreManagerId as any)?._id || ""
            : (centre.centreManagerId as any) || "",
      });
    }
  }, [isOpen, centre, reset]);

  if (!centre) return null;

  const onSubmit = (data: EditCentreFormData) => {
    const payload = {
      ...data,
      centreManagerId: data.centreManagerId || undefined,
    };
    updateCentreMutation.mutate({ id: centre._id, data: payload });
  };

  const selectedManager = staffList.find((s) => s._id === selectedManagerId);

  const getStatusLabel = (val: string) => {
    switch (val) {
      case "active":
        return "Active (Operational)";
      case "inactive":
        return "Inactive";
      case "under_maintenance":
        return "Under Maintenance";
      default:
        return "Select status";
    }
  };

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 dark:bg-primary/15 dark:border-primary/20 dark:text-primary">
              {centre.centreCode}
            </span>
          </div>
          <DialogTitle className="font-bold font-heading">
            Edit Training Centre
          </DialogTitle>
          <DialogDescription>
            Update facility details, capacity, status, and assigned manager.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col"
        >
          <ScrollArea className="h-[380px] sm:h-[400px] py-2">
            <FieldGroup className="px-4 py-2">
              {/* Centre Name */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-xs font-semibold">
                  Centre Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="e.g. Adele Tech Hub (Abuja Central)"
                  className="h-9 min-h-9 text-xs"
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              {/* Status */}
              <Field data-invalid={!!errors.status}>
                <FieldLabel className="text-xs font-semibold">
                  Operating Status <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
                        <SelectValue placeholder="Select status">
                          {getStatusLabel(selectedStatus)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          Active (Operational)
                        </SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="under_maintenance">
                          Under Maintenance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <FieldError>{errors.status.message}</FieldError>
                )}
              </Field>

              {/* State & LGA */}
              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.state}>
                  <FieldLabel className="text-xs font-semibold">
                    State <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register("state")}
                    placeholder="e.g. Lagos"
                    className="h-9 min-h-9 text-xs"
                  />
                  {errors.state && (
                    <FieldError>{errors.state.message}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.lga}>
                  <FieldLabel className="text-xs font-semibold">
                    LGA / District <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register("lga")}
                    placeholder="e.g. Ikeja"
                    className="h-9 min-h-9 text-xs"
                  />
                  {errors.lga && <FieldError>{errors.lga.message}</FieldError>}
                </Field>
              </div>

              {/* Street Address */}
              <Field data-invalid={!!errors.address}>
                <FieldLabel className="text-xs font-semibold">
                  Street Address <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register("address")}
                  placeholder="Full physical street location"
                  className="h-9 min-h-9 text-xs"
                />
                {errors.address && (
                  <FieldError>{errors.address.message}</FieldError>
                )}
              </Field>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.contactEmail}>
                  <FieldLabel className="text-xs font-semibold">
                    Contact Email <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="email"
                    {...register("contactEmail")}
                    placeholder="centre@adelefoundation.org"
                    className="h-9 min-h-9 text-xs"
                  />
                  {errors.contactEmail && (
                    <FieldError>{errors.contactEmail.message}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.contactPhone}>
                  <FieldLabel className="text-xs font-semibold">
                    Contact Phone <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register("contactPhone")}
                    placeholder="e.g. +234 801 234 5678"
                    className="h-9 min-h-9 text-xs font-mono"
                  />
                  {errors.contactPhone && (
                    <FieldError>{errors.contactPhone.message}</FieldError>
                  )}
                </Field>
              </div>

              {/* Capacity & Centre Manager */}
              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.capacity}>
                  <FieldLabel className="text-xs font-semibold">
                    Capacity (Seats) <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("capacity")}
                    placeholder="100"
                    className="h-9 min-h-9 text-xs font-mono"
                  />
                  {errors.capacity && (
                    <FieldError>{errors.capacity.message}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.centreManagerId}>
                  <FieldLabel className="text-xs font-semibold">
                    Centre Manager
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="centreManagerId"
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(val) =>
                          field.onChange(val === "none" ? "" : val)
                        }
                      >
                        <SelectTrigger className="w-full h-9 min-h-9 data-[size=default]:h-9 text-xs">
                          <SelectValue placeholder="Assign manager">
                            {selectedManager
                              ? `${selectedManager.firstName} ${selectedManager.lastName}`
                              : "No manager assigned"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            No manager assigned
                          </SelectItem>
                          {staffList.map((st) => (
                            <SelectItem key={st._id} value={st._id}>
                              {st.firstName} {st.lastName} ({st.position})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.centreManagerId && (
                    <FieldError>{errors.centreManagerId.message}</FieldError>
                  )}
                </Field>
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
              disabled={updateCentreMutation.isPending}
              className="text-xs font-semibold gap-2"
            >
              {updateCentreMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
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
