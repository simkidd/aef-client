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
import { TrainingSession } from "@/interfaces";
import {
  MoreHorizontal,
  Eye,
  Ban,
  Clock,
  MapPin,
  Loader2,
  CalendarDays,
} from "lucide-react";

interface TimetableTableProps {
  sessions: TrainingSession[];
  isLoading: boolean;
  onViewDetails: (session: TrainingSession) => void;
  onCancelSession: (session: TrainingSession) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function TimetableTable({
  sessions,
  isLoading,
  onViewDetails,
  onCancelSession,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: TimetableTableProps) {
  return (
    <Card className="py-0 overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Date & Time</TableHead>
            <TableHead>Cohort & Skill Track</TableHead>
            <TableHead>Training Centre & Room</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
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
                  <p className="text-xs font-medium">Loading scheduled timetable sessions...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((sess) => (
              <TableRow
                key={sess._id}
                className="hover:bg-muted/60 transition-colors group"
              >
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-foreground block">
                      {formatDate(sess.sessionDate)}
                    </span>
                    {sess.slotNumber && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary font-bold rounded">
                        Slot {sess.slotNumber}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-primary font-semibold flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 inline" />
                    {sess.startTime} – {sess.endTime}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-semibold text-foreground block">
                    {sess.skillAreaId?.name || "General Track"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {sess.cohortId?.name || "Cohort"}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="text-foreground block font-medium">
                    {sess.centreId?.name || "Training Facility"}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 inline" />
                    {sess.roomId?.name || "Practical Workshop"}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground">
                  {sess.trainerStaffId
                    ? `${sess.trainerStaffId.firstName} ${sess.trainerStaffId.lastName}`
                    : "Lead Facilitator"}
                </TableCell>
                <TableCell className="text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                    {sess.sessionType || "Practical"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <StatusBadge
                      status={sess.isCancelled ? "Cancelled" : "Scheduled"}
                      size="sm"
                    />
                    {sess.isPublished ? (
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        • Published
                      </span>
                    ) : (
                      <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        • Draft
                      </span>
                    )}
                  </div>
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
                        onClick={() => onViewDetails(sess)}
                        className="gap-2 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        Session Details
                      </DropdownMenuItem>
                      {!sess.isCancelled && (
                        <DropdownMenuItem
                          onClick={() => onCancelSession(sess)}
                          className="gap-2 text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Cancel Session
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">No timetable sessions found</p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your filters or verify cohort training schedules.
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
