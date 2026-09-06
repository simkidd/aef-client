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
import { BiometricEvent } from "@/interfaces";
import {
  MoreHorizontal,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Loader2,
} from "lucide-react";

interface RawScansTableProps {
  events: BiometricEvent[];
  isLoading: boolean;
  onViewDetails: (event: BiometricEvent) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function RawScansTable({
  events,
  isLoading,
  onViewDetails,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: RawScansTableProps) {
  return (
    <Card className="py-0 overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Timestamp</TableHead>
            <TableHead>Device Serial</TableHead>
            <TableHead>Biometric Token</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Trainee Match</TableHead>
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
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium">
                    Loading raw biometric events...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : events && events.length > 0 ? (
            events.map((evt) => (
              <TableRow
                key={evt._id}
                className="hover:bg-muted/60 transition-colors group"
              >
                <TableCell className="text-xs font-mono text-foreground font-semibold">
                  {formatDate(evt.timestamp, true)}
                </TableCell>
                <TableCell className="text-xs font-mono text-foreground">
                  {evt.deviceSerial}
                </TableCell>
                <TableCell className="text-xs font-mono max-w-[140px] truncate text-muted-foreground">
                  {evt.biometricToken}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-muted text-foreground border border-border">
                    {evt.scanType}
                  </span>
                </TableCell>
                <TableCell>
                  {evt.isMatched ? (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {evt.beneficiaryId?.firstName}{" "}
                      {evt.beneficiaryId?.lastName}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Unknown Token
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {evt.isMatched ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Processed
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Held for review
                    </span>
                  )}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
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
                        onClick={() => onViewDetails(evt)}
                        className="gap-2 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        Audit Raw Event
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
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Fingerprint className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">
                    No raw biometric scans received
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hardware events will stream in real-time as trainees scan at
                    physical turnstiles.
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
