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
import { formatDate } from "@/lib/utils";
import { Assessment } from "@/interfaces";
import { MoreHorizontal, Eye, Award, Loader2, ClipboardCheck } from "lucide-react";

interface AssessmentsTableProps {
  assessments: Assessment[];
  isLoading: boolean;
  onViewDetails: (assessment: Assessment) => void;
  onEnterGrades: (assessment: Assessment) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AssessmentsTable({
  assessments,
  isLoading,
  onViewDetails,
  onEnterGrades,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AssessmentsTableProps) {
  return (
    <Card className="py-0 overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Assessment Title & Type</TableHead>
            <TableHead>Cohort & Skill Track</TableHead>
            <TableHead>Max / Pass Benchmarks</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead className="w-[60px] text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium">Loading active assessments...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : assessments && assessments.length > 0 ? (
            assessments.map((ass) => (
              <TableRow
                key={ass._id}
                className="hover:bg-muted/60 transition-colors group"
              >
                <TableCell>
                  <span className="font-bold text-xs text-foreground block">
                    {ass.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {ass.type}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-semibold text-primary block">
                    {ass.skillAreaId?.name || "Skill Track"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {ass.cohortId?.name || "Cohort"}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-mono">
                  Max: <strong className="text-foreground">{ass.maxScore || 100}</strong> • Pass:{" "}
                  <strong className="text-primary">{ass.passingScore || 70}</strong>
                </TableCell>
                <TableCell className="text-xs text-foreground">
                  {formatDate(ass.scheduledDate)}
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
                    <DropdownMenuContent align="end" className="w-44 text-xs">
                      <DropdownMenuItem
                        onClick={() => onViewDetails(ass)}
                        className="gap-2 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        Criteria Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEnterGrades(ass)}
                        className="gap-2 text-primary cursor-pointer focus:text-primary focus:bg-primary/10"
                      >
                        <Award className="h-3.5 w-3.5" />
                        Enter Gradebook
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">No scheduled assessments found</p>
                  <p className="text-xs text-muted-foreground">
                    Schedule a practical or theory evaluation to start recording competency results.
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
