"use client";

import React from "react";
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
import { Staff } from "@/interfaces";
import { useProvisionAccountMutation } from "@/hooks";

export const provisionAccountSchema = z.object({
  role: z.string().min(1, "Please select a system role"),
});

export type ProvisionAccountFormData = z.infer<typeof provisionAccountSchema>;

interface ProvisionAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export function ProvisionAccountModal({
  isOpen,
  onClose,
  staff,
}: ProvisionAccountModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProvisionAccountFormData>({
    resolver: zodResolver(provisionAccountSchema),
    defaultValues: {
      role: "TRAINER",
    },
  });

  const provisionAccountMutation = useProvisionAccountMutation({
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  const onSubmit = (data: ProvisionAccountFormData) => {
    if (!staff) return;
    provisionAccountMutation.mutate({
      staffId: staff._id,
      roles: [data.role],
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Provision System Account</DialogTitle>
          <DialogDescription>
            Assign system credentials and roles to{" "}
            <strong>
              {staff?.firstName} {staff?.lastName}
            </strong>{" "}
            ({staff?.email}).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="provisionRole"
                  className="text-xs font-semibold text-foreground"
                >
                  Assign System Role *
                </FieldLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => {
                    const roleLabels: Record<string, string> = {
                      TRAINER: "Trainer / Instructor (Delivering specific skills & gradebook)",
                      CENTRE_MANAGER: "Centre Manager (Centre scoped)",
                      PROGRAM_MANAGER: "Program Manager (Program scoped)",
                      HR_OFFICER: "HR Officer (Staff & volunteer records)",
                      SUPER_ADMIN: "Super Administrator (Full unrestricted access)",
                    };
                    return (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="provisionRole" className="w-full">
                          <SelectValue placeholder="Select role">
                            {roleLabels[field.value] || field.value}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRAINER">
                            Trainer / Instructor (Delivering specific skills & gradebook)
                          </SelectItem>
                          <SelectItem value="CENTRE_MANAGER">
                            Centre Manager (Centre scoped)
                          </SelectItem>
                          <SelectItem value="PROGRAM_MANAGER">
                            Program Manager (Program scoped)
                          </SelectItem>
                          <SelectItem value="HR_OFFICER">
                            HR Officer (Staff & volunteer records)
                          </SelectItem>
                          <SelectItem value="SUPER_ADMIN">
                            Super Administrator (Full unrestricted access)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                <FieldError>{errors.role?.message}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>

          <p className="text-muted-foreground text-[11px]">
            A default temporary password <strong className="text-foreground font-mono">Adele@2026</strong> will be
            assigned to their work email.
          </p>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={provisionAccountMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={provisionAccountMutation.isPending}
              className="bg-teal-700 hover:bg-teal-800 text-white gap-2"
            >
              {provisionAccountMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Provisioning...</span>
                </>
              ) : (
                "Confirm & Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

