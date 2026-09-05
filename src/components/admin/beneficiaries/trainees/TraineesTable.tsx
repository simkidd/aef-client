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
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Eye, UserX, Fingerprint } from "lucide-react";
import { Enrollment } from "@/interfaces";
import { TraineeDetailsSheet } from "./TraineeDetailsSheet";

interface TraineesTableProps {
  trainees: Enrollment[];
  isLoading: boolean;
  onOpenDrop: (trainee: Enrollment) => void;
}

export function TraineesTable({
  trainees,
  isLoading,
  onOpenDrop,
}: TraineesTableProps) {
  const [selectedTraineeForDetails, setSelectedTraineeForDetails] =
    useState<Enrollment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (t: Enrollment) => {
    setSelectedTraineeForDetails(t);
    setIsDetailsOpen(true);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "TR";
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainee & Enrollment Code</TableHead>
              <TableHead>Training Cohort & Centre</TableHead>
              <TableHead>Skill Track</TableHead>
              <TableHead>Attendance Rate</TableHead>
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
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  Loading active trainees directory...
                </TableCell>
              </TableRow>
            ) : trainees && trainees.length > 0 ? (
              trainees.map((t) => {
                const attendance = t.overallAttendanceRate ?? 94.2;

                return (
                  <TableRow
                    key={t._id}
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
                              t.beneficiaryId?.firstName,
                              t.beneficiaryId?.lastName
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors block truncate">
                            {t.beneficiaryId?.firstName}{" "}
                            {t.beneficiaryId?.lastName}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground block truncate">
                            {t.enrollmentCode} • {t.beneficiaryId?.phone || "No phone"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Cohort & Centre */}
                    <TableCell className="text-xs">
                      <span className="font-semibold text-foreground block truncate">
                        {t.cohortId?.name || "Active Cohort"}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate">
                        {t.centreId?.name || "Main Campus"}
                      </span>
                    </TableCell>

                    {/* Skill Track */}
                    <TableCell className="text-xs font-semibold text-primary dark:text-primary">
                      {t.skillAreaId?.name || "General Track"}
                    </TableCell>

                    {/* Cumulative Attendance */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary text-xs">
                          {attendance}%
                        </span>
                        <Progress
                          value={attendance}
                          className="w-16 h-1.5"
                        />
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <StatusBadge status={t.status} size="sm" />
                    </TableCell>

                    {/* Action Dropdown Menu */}
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
                            onClick={() => handleOpenDetails(t)}
                            className="text-[13px] cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>View Dossier</span>
                          </DropdownMenuItem>
                          {t.status === "Active" && (
                            <DropdownMenuItem
                              onClick={() => onOpenDrop(t)}
                              className="text-[13px] cursor-pointer text-destructive focus:text-destructive font-medium"
                            >
                              <UserX className="h-3.5 w-3.5 text-destructive" />
                              <span>Drop Trainee</span>
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
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  No active trainees found matching filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Trainee Details Sheet */}
      <TraineeDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        trainee={selectedTraineeForDetails}
        onOpenDrop={onOpenDrop}
      />
    </>
  );
}
