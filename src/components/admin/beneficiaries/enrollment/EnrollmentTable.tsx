"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MoreHorizontal,
  Eye,
  UserCheck,
  Fingerprint,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Enrollment } from "@/interfaces";
import { EnrollmentDetailsSheet } from "./EnrollmentDetailsSheet";

interface EnrollmentTableProps {
  queue: Enrollment[];
  isLoading: boolean;
  onOpenVerify: (enrollment: Enrollment) => void;
  onOpenBiometric: (enrollment: Enrollment) => void;
}

export function EnrollmentTable({
  queue,
  isLoading,
  onOpenVerify,
  onOpenBiometric,
}: EnrollmentTableProps) {
  const [selectedEnrForDetails, setSelectedEnrForDetails] =
    useState<Enrollment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (enr: Enrollment) => {
    setSelectedEnrForDetails(enr);
    setIsDetailsOpen(true);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "EN";
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrollment Code & Trainee</TableHead>
              <TableHead>Assigned Centre & Cohort</TableHead>
              <TableHead>Skill Track</TableHead>
              <TableHead>Physical Verification</TableHead>
              <TableHead>Biometric Status</TableHead>
              <TableHead>Lifecycle Status</TableHead>
              <TableHead className="w-[170px] text-right">Desk Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  Loading onboarding queue...
                </TableCell>
              </TableRow>
            ) : queue && queue.length > 0 ? (
              queue.map((enr) => {
                const isVerified = Boolean(
                  enr.verificationDetails?.identityVerified
                );
                const hasBiometrics = Boolean(
                  enr.biometricRegistrationDetails?.biometricIdentifier
                );

                return (
                  <TableRow
                    key={enr._id}
                    onClick={() => handleOpenDetails(enr)}
                    className="cursor-pointer hover:bg-muted/60 transition-colors group"
                  >
                    {/* Candidate: Avatar + Name + Enrollment Code */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          size="sm"
                          className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
                        >
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(
                              enr.beneficiaryId?.firstName,
                              enr.beneficiaryId?.lastName
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors block truncate">
                            {enr.beneficiaryId?.firstName}{" "}
                            {enr.beneficiaryId?.lastName}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground block truncate">
                            {enr.enrollmentCode || "Pending Code"} •{" "}
                            {enr.beneficiaryId?.phone || "No phone"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Centre & Cohort */}
                    <TableCell className="text-xs">
                      <span className="font-semibold text-foreground block truncate">
                        {enr.centreId?.name || "Main Centre"}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate">
                        {enr.cohortId?.name || "Active Cohort"}
                      </span>
                    </TableCell>

                    {/* Skill Track */}
                    <TableCell className="text-xs font-semibold text-primary dark:text-primary">
                      {enr.skillAreaId?.name || "General Track"}
                    </TableCell>

                    {/* Physical Verification */}
                    <TableCell>
                      {isVerified ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 w-fit dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300">
                          <ShieldAlert className="h-3 w-3" /> Pending Check
                        </span>
                      )}
                    </TableCell>

                    {/* Biometric Status */}
                    <TableCell>
                      {hasBiometrics ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                          <Fingerprint className="h-3 w-3" /> Registered
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Not Captured
                        </span>
                      )}
                    </TableCell>

                    {/* Lifecycle Status */}
                    <TableCell>
                      <StatusBadge status={enr.status} size="sm" />
                    </TableCell>

                    {/* Desk Action */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {!isVerified ? (
                          <Button
                            size="sm"
                            onClick={() => onOpenVerify(enr)}
                            className="text-xs h-7 gap-1 font-semibold"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Verify
                          </Button>
                        ) : !hasBiometrics ? (
                          <Button
                            size="sm"
                            onClick={() => onOpenBiometric(enr)}
                            className="text-xs h-7 gap-1 font-semibold"
                          >
                            <Fingerprint className="h-3.5 w-3.5" /> Biometrics
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 gap-1 text-primary border-primary/20"
                            disabled
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Ready
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 p-1">
                            <DropdownMenuItem
                              onClick={() => handleOpenDetails(enr)}
                              className="text-[13px] cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>View Dossier</span>
                            </DropdownMenuItem>
                            {!isVerified && (
                              <DropdownMenuItem
                                onClick={() => onOpenVerify(enr)}
                                className="text-[13px] cursor-pointer font-medium text-primary dark:text-primary focus:text-primary"
                              >
                                <UserCheck className="h-3.5 w-3.5 text-primary" />
                                <span>Verify Identity</span>
                              </DropdownMenuItem>
                            )}
                            {isVerified && !hasBiometrics && (
                              <DropdownMenuItem
                                onClick={() => onOpenBiometric(enr)}
                                className="text-[13px] cursor-pointer font-medium text-primary dark:text-primary focus:text-primary"
                              >
                                <Fingerprint className="h-3.5 w-3.5 text-primary" />
                                <span>Scan Biometrics</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  No candidates currently found in the onboarding queue.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Enrollment Details Sheet */}
      <EnrollmentDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        enrollment={selectedEnrForDetails}
        onOpenVerify={onOpenVerify}
        onOpenBiometric={onOpenBiometric}
      />
    </>
  );
}
