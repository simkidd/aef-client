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
import { MoreHorizontal, Eye, UserCheck, Sparkles } from "lucide-react";
import { Application } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { ApplicationDetailsSheet } from "./ApplicationDetailsSheet";

interface ApplicationsTableProps {
  applications: Application[];
  isLoading: boolean;
  onOpenReview: (application: Application) => void;
}

export function ApplicationsTable({
  applications,
  isLoading,
  onOpenReview,
}: ApplicationsTableProps) {
  const [selectedAppForDetails, setSelectedAppForDetails] =
    useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (app: Application) => {
    setSelectedAppForDetails(app);
    setIsDetailsOpen(true);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "AP";
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate & Application</TableHead>
              <TableHead>Target Track & Program</TableHead>
              <TableHead>Preferred Centre</TableHead>
              <TableHead>Education & Phone</TableHead>
              <TableHead>Submitted On</TableHead>
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
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  Loading applications pipeline...
                </TableCell>
              </TableRow>
            ) : applications && applications.length > 0 ? (
              applications.map((app) => (
                <TableRow
                  key={app._id}
                  className="hover:bg-muted/60 transition-colors group"
                >
                  {/* Candidate: Avatar + Name + Application Code */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
                      >
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(
                            app.beneficiaryId?.firstName,
                            app.beneficiaryId?.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors block truncate">
                          {app.beneficiaryId?.firstName}{" "}
                          {app.beneficiaryId?.lastName}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground block truncate">
                          {app.applicationNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Track & Program */}
                  <TableCell className="text-xs">
                    <span className="font-semibold text-primary dark:text-primary block truncate">
                      {app.preferredSkillAreaId?.name || "General Track"}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {app.programId?.title || "Vocational Initiative"}
                    </span>
                  </TableCell>

                  {/* Preferred Centre */}
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="truncate block max-w-[180px]">
                      {app.preferredCentreId?.name || "Main Technology Centre"}
                    </span>
                  </TableCell>

                  {/* Education & Phone */}
                  <TableCell className="text-xs">
                    <span className="font-medium text-foreground block truncate">
                      {app.beneficiaryId?.highestEducation || "SSCE / WAEC"}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground block truncate">
                      {app.beneficiaryId?.phone || "N/A"}
                    </span>
                  </TableCell>

                  {/* Submitted Date */}
                  <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {formatDate(app.submittedAt)}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <StatusBadge status={app.status} size="sm" />
                  </TableCell>

                  {/* Actions Dropdown */}
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
                          onClick={() => handleOpenDetails(app)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Dossier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onOpenReview(app)}
                          className="text-[13px] cursor-pointer text-primary dark:text-primary font-medium focus:text-primary dark:focus:text-primary"
                        >
                          <UserCheck className="h-3.5 w-3.5 text-primary dark:text-primary" />
                          <span>Review Decision</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  No applications found matching the filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Application Details Sheet */}
      <ApplicationDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        application={selectedAppForDetails}
        onOpenReview={onOpenReview}
      />
    </>
  );
}
