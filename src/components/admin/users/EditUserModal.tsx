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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ScopeType } from "@/interfaces";
import { useUpdateUserRolesAndScopesMutation } from "@/hooks/mutations/useAdminMutations";
import { useCentresQuery } from "@/hooks/queries/useCentreQueries";
import { useAuthStore } from "@/stores/auth.store";
import { ShieldCheck, Building2, Check, Loader2, Info } from "lucide-react";

export const editUserSchema = z
  .object({
    roles: z
      .array(z.string())
      .min(1, "At least one system role must be selected"),
    isActive: z.boolean().default(true),
    scopeType: z
      .enum(["GLOBAL", "CENTRE", "PROGRAM", "DEPARTMENT"])
      .default("GLOBAL"),
    targetCentreId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.scopeType === "CENTRE" && !data.targetCentreId) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a training centre for centre-scoped access",
      path: ["targetCentreId"],
    },
  );

export type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const AVAILABLE_ROLES = [
  {
    code: "SUPER_ADMIN",
    label: "Super Administrator",
    description: "Unrestricted enterprise platform administration",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  {
    code: "CENTRE_MANAGER",
    label: "Centre Manager",
    description: "Manages training centre, devices, rooms and cohorts",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    code: "PROGRAM_MANAGER",
    label: "Program Manager",
    description: "Manages tracks, curricula, applicants and graduation",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  },
  {
    code: "TRAINER",
    label: "Trainer / Instructor",
    description: "Delivers skill sessions, marks attendance & grades",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  {
    code: "HR_OFFICER",
    label: "HR Officer",
    description: "Manages staff records, volunteers and departments",
    color:
      "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  },
  {
    code: "REGISTRATION_OFFICER",
    label: "Registration & Biometric Officer",
    description: "In-person biometric verification and cohort onboarding",
    color:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
  {
    code: "BENEFICIARY",
    label: "Beneficiary",
    description: "Trainee / Candidate portal access",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
];

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const { user: currentUser } = useAuthStore();
  const { data: centresData } = useCentresQuery({ limit: 100 });
  const centres =
    (Array.isArray(centresData) ? centresData : (centresData as any)?.docs) ||
    [];

  const userId = user?.id || user?._id;
  const currentUserId = currentUser?.id || currentUser?._id;
  const isSelf = !!(
    userId &&
    currentUserId &&
    userId.toString() === currentUserId.toString()
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema) as any,
    defaultValues: {
      roles: ["BENEFICIARY"],
      isActive: true,
      scopeType: "GLOBAL",
      targetCentreId: "",
    },
  });

  const selectedRoles = watch("roles") || [];
  const selectedScopeType = watch("scopeType");
  const selectedTargetCentreId = watch("targetCentreId");

  const updateMutation = useUpdateUserRolesAndScopesMutation({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      const primaryScope = user.scopeAssignments?.[0];
      reset({
        roles:
          user.roles && user.roles.length > 0 ? user.roles : ["BENEFICIARY"],
        isActive: user.isActive !== false,
        scopeType: (primaryScope?.scopeType as ScopeType) || "GLOBAL",
        targetCentreId: primaryScope?.targetId || "",
      });
    }
  }, [user, isOpen, reset]);

  if (!user) return null;

  const toggleRole = (roleCode: string) => {
    const current = selectedRoles;
    if (current.includes(roleCode)) {
      if (current.length === 1) return; // Must keep at least one role
      setValue(
        "roles",
        current.filter((r) => r !== roleCode),
        { shouldValidate: true },
      );
    } else {
      setValue("roles", [...current, roleCode], { shouldValidate: true });
    }
  };

  const onSubmit = (data: EditUserFormData) => {
    if (!userId) return;

    const selectedCentre = centres.find(
      (c: any) => (c._id || c.id) === data.targetCentreId,
    );

    const scopeAssignments =
      data.scopeType === "CENTRE" && data.targetCentreId
        ? [
            {
              scopeType: "CENTRE" as ScopeType,
              targetId: data.targetCentreId,
              targetName: selectedCentre?.name || "Assigned Centre",
            },
          ]
        : [{ scopeType: "GLOBAL" as ScopeType }];

    updateMutation.mutate({
      id: userId,
      payload: {
        roles: data.roles,
        isActive: isSelf ? true : data.isActive,
        scopeAssignments,
      },
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
      <DialogContent className="sm:max-w-lg h-[85vh] max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl">
        <DialogHeader className="p-4 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold font-heading text-foreground">
                Edit User Roles & Access
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Manage roles, operating scopes, and active login state for this
                account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6 space-y-5">
              {/* User Summary Card */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user.firstName} {user.lastName}{" "}
                      {isSelf && (
                        <span className="text-xs text-primary font-normal">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    Account Type
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] mt-0.5 font-semibold"
                  >
                    {user.isStaff ? "Staff Account" : "Beneficiary / Trainee"}
                  </Badge>
                </div>
              </div>

              {/* Account Status Switch */}
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex flex-col p-3.5 rounded-xl border border-border bg-card gap-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold text-foreground">
                          Account Status
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          {field.value
                            ? "User is enabled and can authenticate into the platform."
                            : "User is disabled and locked out of all login sessions."}
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSelf}
                      />
                    </div>
                    {isSelf && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 pt-1 border-t border-border/50">
                        <Info className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          You cannot deactivate your own administrator account.
                        </span>
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Roles Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Assigned Roles *</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Select one or more
                  </span>
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(role.code);
                    return (
                      <button
                        key={role.code}
                        type="button"
                        onClick={() => toggleRole(role.code)}
                        className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-2xs ring-1 ring-primary/30"
                            : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">
                              {role.label}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 ${role.color}`}
                            >
                              {role.code}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">
                            {role.description}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-background"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.roles && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.roles.message}
                  </p>
                )}
              </div>

              {/* Scope Assignment */}
              <div className="space-y-2.5 p-3.5 rounded-xl border border-border bg-card">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>Operational Scope</span>
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Define whether this user manages all foundation branches or a
                  specific centre.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    type="button"
                    variant={
                      selectedScopeType === "GLOBAL" ? "default" : "outline"
                    }
                    size="sm"
                    className="text-xs h-8 cursor-pointer"
                    onClick={() => {
                      setValue("scopeType", "GLOBAL", { shouldValidate: true });
                      setValue("targetCentreId", "", { shouldValidate: true });
                    }}
                  >
                    Global (Enterprise)
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedScopeType === "CENTRE" ? "default" : "outline"
                    }
                    size="sm"
                    className="text-xs h-8 cursor-pointer"
                    onClick={() =>
                      setValue("scopeType", "CENTRE", { shouldValidate: true })
                    }
                  >
                    Specific Centre
                  </Button>
                </div>

                {selectedScopeType === "CENTRE" && (
                  <div className="pt-2 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">
                      Select Training Centre *
                    </Label>
                    <Controller
                      control={control}
                      name="targetCentreId"
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Choose a training centre" />
                          </SelectTrigger>
                          <SelectContent>
                            {centres.map((c: any) => (
                              <SelectItem
                                key={c._id || c.id}
                                value={c._id || c.id}
                              >
                                {c.name} ({c.code || "Centre"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.targetCentreId && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        {errors.targetCentreId.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="m-0 p-3 sm:p-4 border-t border-border bg-muted/20 shrink-0 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={updateMutation.isPending}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateMutation.isPending || selectedRoles.length === 0}
              className="text-xs h-8 font-semibold gap-1.5 bg-primary hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
