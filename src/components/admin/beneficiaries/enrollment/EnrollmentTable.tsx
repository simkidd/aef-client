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
import { MoreHorizontal, Eye, UserCheck, Fingerprint, Loader2 } from "lucide-react";
import { Enrollment } from "@/interfaces";
import { EnrollmentDetailsSheet } from "./EnrollmentDetailsSheet";
import { TablePagination } from "@/components/ui/table-pagination";

interface EnrollmentTableProps {
  queue: Enrollment[];
  isLoading: boolean;
  onOpenVerify: (enrollment: Enrollment) => void;
  onOpenBiometric: (enrollment: Enrollment) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function EnrollmentTable({
  queue,
  isLoading,
  onOpenVerify,
  onOpenBiometric,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
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
              <TableHead>Trainee & Enrollment Code</TableHead>
              <TableHead>Assigned Centre & Cohort</TableHead>
              <TableHead>Skill Track</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Loading onboarding queue...</p>
                  </div>
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
                    className="hover:bg-muted/60 transition-colors group"
                  >
                    {/* Trainee: Avatar + Name + Enrollment Code */}
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

                    {/* Lifecycle Status */}
                    <TableCell>
                      <StatusBadge status={enr.status} size="sm" />
                    </TableCell>

                    {/* Action Menu */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserCheck className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">No candidates found in queue</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search query or verification status filter.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {onPageChange && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={onPageChange}
          />
        )}
      </Card>

      {/* Enrollment Details Sheet with full rich content */}
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
