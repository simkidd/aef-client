"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fingerprint,
  Eye,
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";
import { Application } from "@/interfaces";
import { useMyApplicationsQuery } from "@/hooks";

export function MyApplicationsView() {
  const router = useRouter();
  const { data: applications, isLoading } = useMyApplicationsQuery();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const selectedPendingApp = applications?.find(
    (app) =>
      app.status === "Selected" ||
      app.status === "Awaiting Biometric" ||
      app.status === "Awaiting Verification",
  );

  const handleOpenDetails = (app: Application) => {
    setSelectedApp(app);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              My Applications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track the progress and status of your vocational skills and
              empowerment applications.
            </p>
          </div>
          <Link href="/portal/programs">
            <Button size="sm" className="gap-1.5 font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>Browse Programs</span>
            </Button>
          </Link>
        </div>

        {/* Selected / Next Step Alert Banner */}
        {selectedPendingApp && (
          <div className="rounded-2xl border border-amber-300 bg-linear-to-r from-amber-50 to-orange-50/50 p-5 dark:border-amber-800 dark:from-amber-950/40 dark:to-orange-950/20 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                    Action Required: You have been selected!
                  </h3>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300 mt-0.5">
                    Selected for{" "}
                    <strong>
                      {selectedPendingApp.preferredSkillAreaId?.name}
                    </strong>
                    . Please visit{" "}
                    <strong>
                      {selectedPendingApp.preferredCentreId?.name ||
                        "your assigned centre"}
                    </strong>{" "}
                    with your valid ID to complete biometric fingerprint
                    enrollment.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenDetails(selectedPendingApp)}
                className="shrink-0 bg-white hover:bg-amber-50 border-amber-300 text-amber-900 text-xs font-semibold dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200"
              >
                View Instructions
              </Button>
            </div>
          </div>
        )}

        {/* Applications Data Table */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wider">
              Loading your applications...
            </p>
          </div>
        ) : applications && applications.length > 0 ? (
          <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 p-0 shadow-xs">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">
                    Application #
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Program & Skill Track
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Preferred Centre
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Submitted On
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow
                    key={app._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
                    onClick={() => handleOpenDetails(app)}
                  >
                    {/* Application # */}
                    <TableCell className="font-mono text-xs font-medium text-slate-900 dark:text-slate-100">
                      {app.applicationNumber}
                    </TableCell>

                    {/* Program & Skill Track */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block">
                          {app.preferredSkillAreaId?.name || "Technical Track"}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {app.programId?.title || "Empowerment Initiative"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Preferred Centre */}
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {app.preferredCentreId?.name || "Assigned Centre"}
                    </TableCell>

                    {/* Submitted Date */}
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(app.submittedAt)}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <StatusBadge status={app.status} size="sm" />
                    </TableCell>

                    {/* Action Button */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDetails(app)}
                        className="text-xs text-primary h-8 px-2.5 hover:bg-primary/10"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <EmptyState
            title="No Applications Yet"
            description="You have not submitted any program applications yet. Discover open skills tracks and apply in minutes."
            actionLabel="Browse Available Programs"
            onAction={() => router.push("/portal/programs")}
          />
        )}
      </div>

      {/* Application Details Modal */}
      <Dialog
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDetailModalOpen(false);
            setSelectedApp(null);
          }
        }}
      >
        <DialogContent className="max-w-xl! bg-card border border-border shadow-2xl rounded-2xl">
          {selectedApp && (
            <>
              {/* Header */}
              <div className="bg-slate-50 dark:bg-slate-900/80 p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wide block">
                      {selectedApp.applicationNumber}
                    </span>
                    <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-heading">
                      {selectedApp.preferredSkillAreaId?.name ||
                        "Technical Track"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 mt-0.5">
                      {selectedApp.programId?.title}
                    </DialogDescription>
                  </div>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-5 text-xs">
                {/* Physical Biometric instructions if selected */}
                {selectedApp.status === "Selected" && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary dark:bg-primary/15 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Fingerprint className="h-4 w-4 shrink-0" />
                      <span>Next Step: Biometric Verification</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Please report to{" "}
                      <strong>{selectedApp.preferredCentreId?.name}</strong> (
                      {selectedApp.preferredCentreId?.address}) with your
                      original Government ID and WAEC/SSCE educational
                      certificate to complete biometric enrollment.
                    </p>
                  </div>
                )}

                {/* Key Summary Details */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Submitted On
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatDate(selectedApp.submittedAt, true)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Assigned Centre
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedApp.preferredCentreId?.name || "Main Centre"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Education Level
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedApp.beneficiaryId?.highestEducation || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Current Outcome
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                {/* Statement of Purpose */}
                {selectedApp.statementOfPurpose && (
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">
                      Statement of Purpose / Motivation
                    </span>
                    <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedApp.statementOfPurpose}
                    </p>
                  </div>
                )}

                {/* Previous Experience */}
                {selectedApp.previousExperience && (
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">
                      Previous Experience & Background
                    </span>
                    <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedApp.previousExperience}
                    </p>
                  </div>
                )}

                {/* Status Progression Timeline */}
                {selectedApp.statusHistory &&
                  selectedApp.statusHistory.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">
                        Application Progression History
                      </span>
                      <div className="space-y-2">
                        {selectedApp.statusHistory.map((hist, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-[11px]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {hist.status}
                            </span>
                            <span className="text-slate-400">
                              • {formatDate(hist.changedAt, true)}
                            </span>
                            {hist.reason && (
                              <span className="text-slate-500 italic">
                                ({hist.reason})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <DialogFooter className="">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-xs h-9"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
