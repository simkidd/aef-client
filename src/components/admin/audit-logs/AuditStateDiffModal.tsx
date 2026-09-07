"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuditLog } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import {
  Copy,
  ShieldCheck,
  CheckCircle2,
  History,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface AuditStateDiffModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditStateDiffModal({
  log,
  isOpen,
  onClose,
}: AuditStateDiffModalProps) {
  if (!log) return null;

  const handleCopyJson = (data: any, label: string) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.add({
        title: "Copied to Clipboard",
        description: `${label} JSON copied to clipboard.`,
        type: "success",
      });
    } catch {
      toast.add({
        title: "Copy Failed",
        description: "Failed to copy state payload to clipboard.",
        type: "error",
      });
    }
  };

  const hasDiff = !!(log.beforeState || log.afterState);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="h-4 w-4" />
            <span>Forensic Audit Record Inspector</span>
          </div>
          <DialogTitle className="text-lg font-bold font-heading text-foreground mt-1">
            {log.action}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Executed by{" "}
            <strong className="text-foreground">
              {log.userName || log.userEmail}
            </strong>{" "}
            on {formatDate(log.timestamp, true)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 sm:p-6 space-y-5">
            {/* Metadata Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">
                  Target Entity
                </span>
                <span className="font-bold text-foreground block">
                  {log.entityType}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground truncate block">
                  ID: {log.entityId}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">
                  Actor Details
                </span>
                <span className="font-bold text-foreground block">
                  {log.userName || "System"}
                </span>
                <span className="text-[11px] text-muted-foreground truncate block">
                  {log.userEmail}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">
                  Timestamp
                </span>
                <span className="font-mono font-semibold text-foreground block">
                  {new Date(log.timestamp).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {new Date(log.timestamp).toLocaleDateString("en-NG", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
            </div>

            {/* Justification / Reason */}
            {log.reason && (
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Mandatory Administrative Justification</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {log.reason}
                </p>
              </div>
            )}

            {/* State Diffs */}
            {hasDiff ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    <span>State Mutation Snapshot (Diff)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    {log.beforeState && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopyJson(log.beforeState, "Before State")
                        }
                        className="h-6 text-[11px] px-2 gap-1"
                      >
                        <Copy className="h-3 w-3" /> Before
                      </Button>
                    )}
                    {log.afterState && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopyJson(log.afterState, "After State")
                        }
                        className="h-6 text-[11px] px-2 gap-1"
                      >
                        <Copy className="h-3 w-3" /> After
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Before State */}
                  <div className="rounded-xl border border-border overflow-hidden bg-muted/10">
                    <div className="px-3 py-2 border-b border-border bg-muted/40 flex items-center justify-between">
                      <span className="font-semibold text-xs text-rose-600 dark:text-rose-400">
                        Before State (Previous)
                      </span>
                    </div>
                    <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-72 text-muted-foreground">
                      {log.beforeState
                        ? JSON.stringify(log.beforeState, null, 2)
                        : "// No prior recorded snapshot (Created / New)"}
                    </pre>
                  </div>

                  {/* After State */}
                  <div className="rounded-xl border border-border overflow-hidden bg-muted/10">
                    <div className="px-3 py-2 border-b border-border bg-muted/40 flex items-center justify-between">
                      <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                        After State (Mutated)
                      </span>
                    </div>
                    <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-72 text-foreground font-medium">
                      {log.afterState
                        ? JSON.stringify(log.afterState, null, 2)
                        : "// Entity was deleted or no after state captured"}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center border rounded-xl border-dashed border-border bg-muted/20">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">
                  This audit log represents an event trigger with no stored
                  before/after delta.
                </span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-3 sm:p-4 border-t border-border bg-muted/20 shrink-0 flex flex-row items-center justify-between sm:justify-between">
          <span className="text-[11px] font-mono text-muted-foreground">
            Log ID: {log._id}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close Inspector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
