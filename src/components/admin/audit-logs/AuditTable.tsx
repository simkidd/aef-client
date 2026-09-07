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
import { TablePagination } from "@/components/ui/table-pagination";
import { formatDate } from "@/lib/utils";
import { AuditLog } from "@/interfaces";
import { Eye, ShieldCheck, History, Loader2, User, Copy } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onInspect: (log: AuditLog) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AuditTable({
  logs,
  isLoading,
  onInspect,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AuditTableProps) {
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.add({
      title: "ID Copied",
      description: `Entity ID copied to clipboard: ${id}`,
      type: "success",
    });
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("ENROLL") || action.includes("APPROVE")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
    if (action.includes("DELETE") || action.includes("DROP") || action.includes("REJECT")) {
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
    if (action.includes("CORRECT") || action.includes("UPDATE") || action.includes("EDIT")) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <Card className="py-0 gap-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Timestamp</TableHead>
            <TableHead>Actor / User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target Entity</TableHead>
            <TableHead>Justification / Reason</TableHead>
            <TableHead className="text-right">Inspect</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs font-semibold">Loading immutable audit logs...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <History className="h-8 w-8 text-muted-foreground/40 mb-1" />
                  <span className="text-sm font-bold text-foreground">No audit records found</span>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    No administrative mutations match your selected search criteria.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log._id} className="hover:bg-muted/40 transition-colors">
                {/* Timestamp */}
                <TableCell className="text-xs font-mono whitespace-nowrap">
                  <span className="font-semibold text-foreground block">
                    {new Date(log.timestamp).toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {new Date(log.timestamp).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </TableCell>

                {/* Actor */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <strong className="text-xs font-bold text-foreground block truncate">
                        {log.userName || "System"}
                      </strong>
                      <span className="text-[10px] text-muted-foreground block truncate font-mono">
                        {log.userEmail || "system@adele.org"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Action Badge */}
                <TableCell>
                  <span
                    className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${getActionBadgeColor(
                      log.action,
                    )}`}
                  >
                    {log.action}
                  </span>
                </TableCell>

                {/* Target Entity */}
                <TableCell className="text-xs">
                  <span className="font-semibold text-foreground block">
                    {log.entityType}
                  </span>
                  <button
                    onClick={() => handleCopyId(log.entityId)}
                    title="Click to copy ID"
                    className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <span className="truncate max-w-[120px]">{log.entityId}</span>
                    <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </TableCell>

                {/* Reason */}
                <TableCell className="text-xs text-muted-foreground max-w-xs">
                  <p className="truncate line-clamp-1" title={log.reason || "Automated mutation"}>
                    {log.reason || <span className="italic text-muted-foreground/60">Automated Mutation</span>}
                  </p>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onInspect(log)}
                    className="h-7 text-xs font-semibold gap-1 px-2.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Diff State</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && total > 0 && onPageChange && (
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
