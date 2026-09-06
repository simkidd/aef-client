"use client";

import React from "react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/ui/table-pagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { AttendanceRecord } from "@/interfaces";
import {
  MoreHorizontal,
  Eye,
  Edit3,
  Loader2,
  UserCheck,
} from "lucide-react";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  isLoading: boolean;
  onViewDetails: (record: AttendanceRecord) => void;
  onOpenCorrection: (record: AttendanceRecord) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AttendanceTable({
  records,
  isLoading,
  onViewDetails,
  onOpenCorrection,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AttendanceTableProps) {
  return (
    <Card className="py-0 overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Enrolled Trainee</TableHead>
            <TableHead>Cohort & Skill Track</TableHead>
            <TableHead>First In / Last Out</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Calculated Status</TableHead>
            <TableHead className="w-[60px] text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium">Loading attendance records...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : records && records.length > 0 ? (
            records.map((rec) => (
              <TableRow
                key={rec._id}
                className="hover:bg-muted/60 transition-colors group"
              >
                <TableCell className="text-xs font-semibold text-foreground">
                  {formatDate(rec.date)}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-xs text-foreground block">
                    {rec.beneficiaryId?.firstName} {rec.beneficiaryId?.lastName}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {rec.beneficiaryId?.beneficiaryCode}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-semibold text-foreground block">
                    {rec.skillAreaId?.name || "Skill Track"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {rec.cohortId?.name || "Cohort"}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-mono">
                  <span className="block text-foreground font-semibold">
                    {rec.firstClockIn
                      ? formatDate(rec.firstClockIn, true).split(",")[1]
                      : "—"}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {rec.lastClockOut
                      ? formatDate(rec.lastClockOut, true).split(",")[1]
                      : "—"}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-foreground">
                  {rec.durationMinutes ? `${rec.durationMinutes} mins` : "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={rec.status} size="sm" />
                  {rec.isManualCorrection && (
                    <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                      * Manual Override
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 text-xs">
                      <DropdownMenuItem
                        onClick={() => onViewDetails(rec)}
                        className="gap-2 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        Audit Log Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onOpenCorrection(rec)}
                        className="gap-2 text-amber-600 dark:text-amber-400 cursor-pointer focus:bg-amber-500/10"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Override Attendance
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <UserCheck className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">No attendance records found</p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting the centre, cohort, or status filters.
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
  );
}
