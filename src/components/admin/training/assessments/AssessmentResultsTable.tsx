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
import { TablePagination } from "@/components/ui/table-pagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Loader2, GraduationCap } from "lucide-react";

interface AssessmentResultsTableProps {
  results: any[];
  isLoading: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AssessmentResultsTable({
  results,
  isLoading,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AssessmentResultsTableProps) {
  return (
    <Card className="py-0 overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Enrolled Trainee</TableHead>
            <TableHead>Assessment Title</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Outcome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium">Loading gradebook results...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : results && results.length > 0 ? (
            results.map((res) => (
              <TableRow
                key={res._id}
                className="hover:bg-muted/60 transition-colors group"
              >
                <TableCell>
                  <span className="font-bold text-xs text-foreground block">
                    {res.beneficiaryId?.firstName} {res.beneficiaryId?.lastName}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {res.beneficiaryId?.beneficiaryCode}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground">
                  {res.assessmentId?.title || "Assessment Evaluation"}
                </TableCell>
                <TableCell className="font-bold text-xs text-foreground">
                  {res.score}/{res.assessmentId?.maxScore || 100}
                </TableCell>
                <TableCell className="text-xs font-mono font-semibold text-foreground">
                  {res.percentage}%
                </TableCell>
                <TableCell className="text-xs font-bold text-primary">
                  {res.grade || "Pass"}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={res.passed ? "Completed" : "Failed"}
                    size="sm"
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">No recorded assessment grades yet</p>
                  <p className="text-xs text-muted-foreground">
                    Use the active assessments table above to submit batch grades for trainees.
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
