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
import { Staff } from "@/interfaces";
import { useCreateCentreMutation } from "@/hooks";

export const addCentreSchema = z.object({
  name: z.string().min(3, "Centre name must be at least 3 characters"),
  centreCode: z.string().optional(),
  state: z.string().min(2, "State is required"),
  lga: z.string().min(2, "LGA / District is required"),
  address: z.string().min(5, "Physical street address is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(7, "Please enter a valid contact phone number"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1 seat"),
  status: z.enum(["active", "inactive", "under_maintenance"]),
  centreManagerId: z.string().optional(),
});

export type AddCentreFormData = z.infer<typeof addCentreSchema>;

interface AddCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList?: Staff[];
  suggestedCode?: string;
}

export function AddCentreModal({
  isOpen,
  onClose,
  staffList = [],
  suggestedCode,
}: AddCentreModalProps) {
  const createCentreMutation = useCreateCentreMutation({
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
  } = useForm<AddCentreFormData>({
    resolver: zodResolver(addCentreSchema) as any,
    defaultValues: {
      name: "",
      centreCode: suggestedCode || "",
      state: "Lagos",
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
    if (isOpen) {
      reset({
        name: "",
        centreCode: suggestedCode || "",
        state: "Lagos",
        lga: "",
        address: "",
        contactEmail: "",
        contactPhone: "",
        capacity: 100,
        status: "active",
        centreManagerId: "",
      });
    }
  }, [isOpen, reset, suggestedCode]);

  const onSubmit = (data: AddCentreFormData) => {
    const payload = {
      ...data,
      centreCode: data.centreCode || suggestedCode,
      centreManagerId: data.centreManagerId || undefined,
    };
    createCentreMutation.mutate(payload);
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
          <DialogTitle className="font-bold font-heading">
            Add New Training Centre
          </DialogTitle>
          <DialogDescription>
            Register a new accredited training facility and configure its base
            capacity and contact info.
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

              {/* Centre Code & Status */}
              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.centreCode}>
                  <FieldLabel className="text-xs font-semibold">
                    Centre Code
                  </FieldLabel>
                  <Input
                    {...register("centreCode")}
                    placeholder={suggestedCode || "e.g. AEF-CTR-03"}
                    className="h-9 min-h-9 text-xs font-mono"
                  />
                  {errors.centreCode && (
                    <FieldError>{errors.centreCode.message}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.status}>
                  <FieldLabel className="text-xs font-semibold">
                    Initial Status <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
              </div>

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
                    Centre Manager (Optional)
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
              disabled={createCentreMutation.isPending}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold gap-2"
            >
              {createCentreMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Registering...
                </>
              ) : (
                "Register Centre"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
