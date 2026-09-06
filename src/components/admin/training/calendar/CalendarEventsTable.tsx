"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Eye,
  Loader2,
  CalendarX,
  Sparkles,
} from "lucide-react";
import { TrainingSession } from "@/interfaces/program.interface";
import { format } from "date-fns";
import { TablePagination } from "@/components/ui/table-pagination";
import { StatusBadge } from "@/components/common/StatusBadge";

interface CalendarEventsTableProps {
  events: TrainingSession[];
  isLoading: boolean;
  onViewEvent: (event: TrainingSession) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export const CalendarEventsTable: React.FC<CalendarEventsTableProps> = ({
  events,
  isLoading,
  onViewEvent,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Session & Type
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Date & Schedule
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Cohort & Centre
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Facilitator
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right w-[80px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium">Loading calendar schedule...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : events && events.length > 0 ? (
            events.map((event) => {
              const isCancelled = event.isCancelled;
              const formattedDate = event.sessionDate
                ? format(new Date(event.sessionDate), "EEE, MMM d, yyyy")
                : "TBD";

              const cohortName =
                typeof event.cohortId === "object"
                  ? event.cohortId?.name
                  : "Cohort";

              const centreName =
                typeof event.centreId === "object"
                  ? event.centreId?.name
                  : "Main Hub";

              const trainerName =
                typeof event.trainerStaffId === "object"
                  ? `${event.trainerStaffId?.firstName || ""} ${event.trainerStaffId?.lastName || ""}`.trim() ||
                    event.trainerStaffId?.user?.name ||
                    "Assigned Trainer"
                  : "Assigned Trainer";

              return (
                <TableRow
                  key={event._id}
                  onClick={() => onViewEvent(event)}
                  className="border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  {/* Session Topic & Type */}
                  <TableCell className="py-3">
                    <div className="flex flex-col max-w-[260px]">
                      <span className="font-medium text-foreground text-xs truncate group-hover:text-primary transition-colors">
                        {event.topic || "Training Session"}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-muted-foreground truncate">
                          {event.skillAreaId?.name || event.programId?.title || "Vocational Track"}
                        </span>
                        <span className="text-muted-foreground/40">•</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 h-4 font-normal bg-muted/50 border-border text-muted-foreground"
                        >
                          {event.sessionType || "Lecture"}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  {/* Date & Schedule */}
                  <TableCell className="py-3">
                    <div className="flex flex-col text-xs">
                      <span className="font-medium text-foreground">
                        {formattedDate}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {event.startTime || "09:00"} – {event.endTime || "12:00"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cohort & Centre */}
                  <TableCell className="py-3">
                    <div className="flex flex-col text-xs max-w-[180px]">
                      <span className="font-medium text-foreground truncate">
                        {cohortName}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {centreName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Facilitator */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {trainerName[0] || "T"}
                      </div>
                      <span className="truncate max-w-[140px]">
                        {trainerName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    <StatusBadge
                      status={isCancelled ? "Cancelled" : "Scheduled"}
                      size="sm"
                    />
                  </TableCell>

                  {/* Quick Action */}
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewEvent(event);
                      }}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <CalendarX className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">
                    No calendar sessions found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No training events match the selected filters or search terms.
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
    </div>
  );
};

