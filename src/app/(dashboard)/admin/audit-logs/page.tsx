"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, ShieldCheck, Search, Filter, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { AuditLog } from "@/interfaces";

export default function AuditTrailExplorerPage() {
  const [actionFilter, setActionFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["admin-audit-logs", actionFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (actionFilter) params.append("action", actionFilter);
      const res = await api.get(`/admin/audit-logs?${params.toString()}`);
      return res.data?.data as AuditLog[];
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Immutable Audit Trail Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Permanent forensic log of all administrative actions, application
            status transitions, attendance corrections, and security
            modifications.
          </p>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <Input
            placeholder="Filter by action (e.g. ATTENDANCE_MANUALLY_CORRECTED, TRAINEE_DROPPED)..."
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs max-w-md"
          />
        </Card>

        {/* Audit Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Actor</TableHead>
                <TableHead>Action Code</TableHead>
                <TableHead>Entity Type & ID</TableHead>
                <TableHead>Mandatory Reason / Notes</TableHead>
                <TableHead>Inspect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData && logsData.length > 0 ? (
                logsData.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="text-xs font-mono">
                      {formatDate(log.timestamp, true)}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {log.userEmail}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 dark:bg-primary/15 dark:text-primary">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                        {log.entityType}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {log.entityId}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {log.reason || "Automated System Event"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Diff State
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No audit records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* State Inspection Modal */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Audit Record State Inspector</DialogTitle>
              <DialogDescription>
                Action: <strong>{selectedLog?.action}</strong> by{" "}
                {selectedLog?.userName} ({selectedLog?.userEmail})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  State Mutation Diff
                </span>
                <pre className="p-3 rounded-lg bg-slate-900 text-primary text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(
                    {
                      beforeState: selectedLog?.beforeState || null,
                      afterState: selectedLog?.afterState || null,
                      reason: selectedLog?.reason,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
