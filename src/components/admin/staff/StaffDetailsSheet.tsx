"use client";

import React from "react";
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
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Key,
  User,
  HeartHandshake,
} from "lucide-react";
import { Staff } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface StaffDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onOpenProvision?: (staff: Staff) => void;
}

export function StaffDetailsSheet({
  isOpen,
  onClose,
  staff,
  onOpenProvision,
}: StaffDetailsSheetProps) {
  if (!staff) return null;

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
        className="w-full sm:max-w-lg! p-0 flex flex-col justify-between overflow-hidden gap-0"
        showCloseButton={false}
      >
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="p-0 text-left border-b pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                  {staff.staffCode}
                </span>
                <StatusBadge status={staff.employmentStatus} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {staff.firstName} {staff.lastName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {staff.position} •{" "}
                <span className="capitalize">{staff.category}</span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Department
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">
                    {staff.departmentId?.name || "Central Org"}
                  </span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Assigned Centre
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">
                    {staff.assignedCentreId?.name || "Headquarters"}
                  </span>
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Contact & Personal Details
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </span>
                  <span className="font-medium text-foreground select-all">
                    {staff.email}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {staff.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Gender
                  </span>
                  <span className="font-medium text-foreground capitalize">
                    {staff.gender || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Date Joined
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(staff.dateJoined)}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {(staff as any).emergencyContact && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Emergency Contact
                </h4>
                <div className="rounded-lg border bg-card p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />{" "}
                      Contact Name
                    </span>
                    <span className="font-medium text-foreground">
                      {(staff as any).emergencyContact.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Relationship</span>
                    <span className="font-medium text-foreground">
                      {(staff as any).emergencyContact.relationship || "Family"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Emergency Phone
                    </span>
                    <span className="font-medium text-foreground font-mono">
                      {(staff as any).emergencyContact.phone}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* System Account Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                System Access & Security
              </h4>
              <div className="rounded-lg border p-3.5 bg-card space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    {staff.hasSystemAccount ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>System Login Active</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span>No Account Provisioned</span>
                      </>
                    )}
                  </span>
                  {staff.hasSystemAccount ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                      Unprovisioned
                    </span>
                  )}
                </div>

                {!staff.hasSystemAccount && onOpenProvision && (
                  <div className="pt-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        onClose();
                        onOpenProvision(staff);
                      }}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold gap-2"
                    >
                      <Key className="h-3.5 w-3.5" /> Provision Login Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full text-xs"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
