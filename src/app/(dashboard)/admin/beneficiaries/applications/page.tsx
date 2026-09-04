"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Clock,
  UserCheck,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Application } from "@/interfaces";

export default function ApplicationsPipelinePage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("Selected");
  const [reviewReason, setReviewReason] = useState("");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications-pipeline", statusFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      const res = await api.get(`/applications?${params.toString()}`);
      return res.data?.data as Application[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: string;
      reason: string;
    }) => {
      const res = await api.put(`/applications/${id}/status`, {
        status,
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsReviewModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["admin-applications-pipeline"],
      });
    },
  });

  const handleOpenReview = (app: Application) => {
    setSelectedApp(app);
    setReviewStatus("Selected");
    setReviewReason("");
    setIsReviewModalOpen(true);
  };

  const handleConfirmReview = () => {
    if (!selectedApp) return;
    updateStatusMutation.mutate({
      id: selectedApp._id,
      status: reviewStatus,
      reason: reviewReason || `Status updated to ${reviewStatus}`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Applications Review Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review incoming candidate applications. Selecting a candidate
              automatically routes them to the Physical Verification & Biometric
              Registration Queue.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Input
              placeholder="Search by candidate name, application number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">All Lifecycle Statuses</option>
              <option value="Submitted">Submitted (Awaiting Review)</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected (Queued for Biometrics)</option>
              <option value="Enrollment Confirmed">Enrollment Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </Card>

        {/* Pipeline Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App Number & Candidate</TableHead>
                <TableHead>Program & Preferred Track</TableHead>
                <TableHead>Preferred Centre</TableHead>
                <TableHead>Education & Phone</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {app.beneficiaryId?.firstName}{" "}
                        {app.beneficiaryId?.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {app.applicationNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-teal-800 dark:text-teal-300 block">
                        {app.preferredSkillAreaId?.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {app.programId?.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {app.preferredCentreId?.name || "Main Centre"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="block">
                        {app.beneficiaryId?.highestEducation || "SSCE/WAEC"}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {app.beneficiaryId?.phone}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {formatDate(app.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReview(app)}
                        className="text-xs font-semibold h-7"
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No applications found matching filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Review Dialog */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Application Review & Selection</DialogTitle>
              <DialogDescription>
                Candidate:{" "}
                <strong>
                  {selectedApp?.beneficiaryId?.firstName}{" "}
                  {selectedApp?.beneficiaryId?.lastName}
                </strong>{" "}
                ({selectedApp?.applicationNumber})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
                <p>
                  <strong>Skill Area:</strong>{" "}
                  {selectedApp?.preferredSkillAreaId?.name}
                </p>
                <p>
                  <strong>Education:</strong>{" "}
                  {selectedApp?.beneficiaryId?.highestEducation}
                </p>
                <p>
                  <strong>State of Residence:</strong>{" "}
                  {selectedApp?.beneficiaryId?.stateOfResidence}
                </p>
                {selectedApp?.statementOfPurpose && (
                  <p className="pt-1 text-slate-600 dark:text-slate-400 italic">
                    "{selectedApp.statementOfPurpose}"
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Set Decision Status *
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="Selected">
                    Selected (Advance to Verification & Biometric Registration)
                  </option>
                  <option value="Shortlisted">
                    Shortlisted (Under consideration)
                  </option>
                  <option value="Under Review">Under Review</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reviewer Justification / Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  placeholder="e.g. Candidate meets qualification threshold and has technical aptitude."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReview}
                disabled={updateStatusMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {updateStatusMutation.isPending
                  ? "Updating..."
                  : "Save Decision"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
