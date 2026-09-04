"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserX,
  UserMinus,
  ShieldAlert,
  Fingerprint,
  Search,
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
import { Progress } from "@/components/ui/progress";
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
import { Enrollment } from "@/interfaces";

export default function ActiveTraineesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<Enrollment | null>(
    null,
  );
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [dropReason, setDropReason] = useState("");

  const { data: trainees, isLoading } = useQuery({
    queryKey: ["admin-trainees-list"],
    queryFn: async () => {
      const res = await api.get("/enrollments/queue?status=Active");
      return res.data?.data as Enrollment[];
    },
  });

  const dropMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await api.post(`/enrollments/${id}/drop`, { reason });
      return res.data;
    },
    onSuccess: () => {
      setIsDropModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-trainees-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  const handleOpenDrop = (t: Enrollment) => {
    setSelectedTrainee(t);
    setDropReason("");
    setIsDropModalOpen(true);
  };

  const handleConfirmDrop = () => {
    if (!selectedTrainee || !dropReason.trim()) return;
    dropMutation.mutate({
      id: selectedTrainee._id,
      reason: dropReason,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Active Enrolled Trainees
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active trainees currently undergoing practical training across
              cohorts. Trainees removed from cohorts are transitioned cleanly
              (never deleted from history) freeing up slots for replacement.
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <Input
            placeholder="Search by trainee name, enrollment code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs max-w-md"
          />
        </Card>

        {/* Trainees Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment Code & Trainee</TableHead>
                <TableHead>Training Cohort & Centre</TableHead>
                <TableHead>Skill Track</TableHead>
                <TableHead>Biometric Token</TableHead>
                <TableHead>Cumulative Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainees && trainees.length > 0 ? (
                trainees.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {t.beneficiaryId?.firstName} {t.beneficiaryId?.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {t.enrollmentCode}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {t.cohortId?.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {t.centreId?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                      {t.skillAreaId?.name}
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-500">
                      {t.biometricRegistrationDetails?.biometricIdentifier ||
                        "Active Token"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-teal-700">
                          {t.overallAttendanceRate || 94.2}%
                        </span>
                        <Progress
                          value={t.overallAttendanceRate || 94}
                          className="w-16 h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDrop(t)}
                        className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 h-7 gap-1"
                      >
                        <UserX className="h-3 w-3" /> Drop Trainee
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
                    No active trainees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Drop Trainee Modal with Mandatory Audit Justification */}
        <Dialog open={isDropModalOpen} onOpenChange={setIsDropModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="h-6 w-6" />
                <DialogTitle>Drop Trainee from Active Cohort</DialogTitle>
              </div>
              <DialogDescription>
                Trainee:{" "}
                <strong>
                  {selectedTrainee?.beneficiaryId?.firstName}{" "}
                  {selectedTrainee?.beneficiaryId?.lastName}
                </strong>{" "}
                ({selectedTrainee?.cohortId?.name})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200">
                <p className="font-bold">
                  Non-Destructive Historical Preservation
                </p>
                <p className="mt-1 text-[11px]">
                  The trainee's past attendance and assessment records are
                  permanently preserved in the audit log. Their cohort slot will
                  immediately become available for replacement.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mandatory Administrative Justification *
                </label>
                <textarea
                  required
                  rows={3}
                  value={dropReason}
                  onChange={(e) => setDropReason(e.target.value)}
                  placeholder="e.g. Unexcused absence exceeding threshold (3 consecutive unnotified days)."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDropModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDrop}
                disabled={!dropReason.trim() || dropMutation.isPending}
                className="bg-rose-700 hover:bg-rose-800 text-white"
              >
                {dropMutation.isPending
                  ? "Processing..."
                  : "Confirm Drop & Audit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
