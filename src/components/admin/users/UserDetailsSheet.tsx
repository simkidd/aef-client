"use client";

import React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Edit3,
  ExternalLink,
  Lock,
  UserCheck,
  UserX,
} from "lucide-react";
import { User as UserType } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

interface UserDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onOpenEdit?: (user: UserType) => void;
  onToggleStatus?: (user: UserType) => void;
}

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  CENTRE_MANAGER: {
    label: "Centre Manager",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  PROGRAM_MANAGER: {
    label: "Program Manager",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  },
  TRAINER: {
    label: "Trainer",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  HR_OFFICER: {
    label: "HR Officer",
    color:
      "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  },
  REGISTRATION_OFFICER: {
    label: "Reg. Officer",
    color:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
  BENEFICIARY: {
    label: "Beneficiary",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
};

export function UserDetailsSheet({
  isOpen,
  onClose,
  user,
  onOpenEdit,
  onToggleStatus,
}: UserDetailsSheetProps) {
  const { user: currentUser } = useAuthStore();
  if (!user) return null;

  const userId = user.id || user._id;
  const currentUserId = currentUser?.id || currentUser?._id;
  const isSelf = !!(userId && currentUserId && userId.toString() === currentUserId.toString());

  const isActiveAccount = user.isActive !== false;
  const primaryRole = user.roles?.[0] || (user.isStaff ? "TRAINER" : "BENEFICIARY");

  return (
    <Sheet
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          onClose();
        }
      }}
    >
      <SheetContent
        className="w-full! sm:max-w-lg! p-0 flex flex-col justify-between overflow-hidden gap-0"
        showCloseButton={false}
      >
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="p-0 text-left border-b pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                  {user.isStaff ? "STAFF ACCOUNT" : "BENEFICIARY ACCOUNT"}
                </span>
                <StatusBadge
                  status={isActiveAccount ? "Active" : "Inactive"}
                  size="sm"
                />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {user.firstName} {user.lastName} {isSelf && <span className="text-sm font-normal text-primary">(You)</span>}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {user.email}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Primary Role
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    {ROLE_BADGES[primaryRole]?.label || primaryRole}
                  </span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Operational Scope
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    {user.scopeAssignments?.[0]?.targetName ||
                      user.scopeAssignments?.[0]?.scopeType ||
                      "Global (Enterprise)"}
                  </span>
                </span>
              </div>
            </div>

            {/* Account & Profile Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Account & Identity
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </span>
                  <span className="font-medium text-foreground select-all">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {user.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Gender
                  </span>
                  <span className="font-medium text-foreground capitalize">
                    {user.gender || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Registered Date
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(user.createdAt, true)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Last Active / Login
                  </span>
                  <span className="font-medium text-foreground">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt, true) : "Never logged in"}
                  </span>
                </div>
              </div>
            </div>

            {/* Permissions & Roles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Assigned System Roles
              </h4>
              <div className="rounded-lg border bg-card p-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {user.roles?.map((role) => {
                    const badge = ROLE_BADGES[role] || {
                      label: role,
                      color: "bg-muted text-foreground border-border",
                    };
                    return (
                      <Badge
                        key={role}
                        variant="outline"
                        className={`text-xs font-semibold px-2.5 py-1 ${badge.color}`}
                      >
                        {badge.label}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Roles grant access to system dashboards, permission gates, and operational tools.
                </p>
              </div>
            </div>

            {/* Linked Entity Record */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Linked Organization Record
              </h4>
              <div className="rounded-lg border bg-card p-3.5 flex items-center justify-between">
                {user.isStaff ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Staff HR File
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Employee profile in Organization Directory
                        </p>
                      </div>
                    </div>
                    <Link href="/admin/organization/staff">
                      <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open Staff File</span>
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Beneficiary / Trainee Record
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {user.beneficiaryProfileId?.beneficiaryCode || "Candidate Registry"}
                        </p>
                      </div>
                    </div>
                    <Link href="/admin/beneficiaries/trainees">
                      <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open Trainee File</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/20 flex flex-row items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Button
                variant="outline"
                size="sm"
                disabled={isSelf && isActiveAccount}
                title={isSelf ? "You cannot deactivate your own account" : undefined}
                onClick={() => {
                  if (isSelf && isActiveAccount) return;
                  onToggleStatus(user);
                  onClose();
                }}
                className="text-xs h-8 gap-1.5"
              >
                {isActiveAccount ? (
                  <>
                    <UserX className="h-3.5 w-3.5 text-rose-500" />
                    <span>Disable</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Enable</span>
                  </>
                )}
              </Button>
            )}

            {onOpenEdit && (
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenEdit(user);
                }}
                className="text-xs h-8 font-semibold gap-1.5 bg-primary"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Roles</span>
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
