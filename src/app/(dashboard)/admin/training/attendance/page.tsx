"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserCheck,
  Edit3,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Filter,
  AlertTriangle,
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
import { AttendanceRecord, TrainingCentre, Cohort } from "@/interfaces";

export default function DailyAttendanceSheetPage() {
  const queryClient = useQueryClient();
  const [centreFilter, setCentreFilter] = useState("");
  const [cohortFilter, setCohortFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  );
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  // Correction fields
  const [newStatus, setNewStatus] = useState("Present");
  const [correctionReason, setCorrectionReason] = useState("");

  const { data: attendanceSheet, isLoading } = useQuery({
    queryKey: [
      "admin-attendance-sheet",
      centreFilter,
      cohortFilter,
      statusFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (centreFilter) params.append("centreId", centreFilter);
      if (cohortFilter) params.append("cohortId", cohortFilter);
      if (statusFilter) params.append("status", statusFilter);
      const res = await api.get(`/attendance/sheet?${params.toString()}`);
      return res.data?.data as AttendanceRecord[];
    },
  });

  const { data: centres } = useQuery({
    queryKey: ["admin-centres-lookup"],
    queryFn: async () => {
      const res = await api.get("/centres");
      return res.data?.data as TrainingCentre[];
    },
  });

  const { data: cohorts } = useQuery({
    queryKey: ["admin-cohorts-lookup"],
    queryFn: async () => {
      const res = await api.get("/cohorts");
      return res.data?.data as Cohort[];
    },
  });

  const correctMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
      reason,
    }: {
      id: string;
      newStatus: string;
      reason: string;
    }) => {
      const res = await api.post(`/attendance/corrections/${id}`, {
        newStatus,
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsCorrectionModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-attendance-sheet"] });
      queryClient.invalidateQueries({ queryKey: ["today-training-summary"] });
    },
  });

  const handleOpenCorrection = (rec: AttendanceRecord) => {
    setSelectedRecord(rec);
    setNewStatus(rec.status);
    setCorrectionReason("");
    setIsCorrectionModalOpen(true);
  };

  const handleConfirmCorrection = () => {
    if (!selectedRecord || !correctionReason.trim()) return;
    correctMutation.mutate({
      id: selectedRecord._id,
      newStatus,
      reason: correctionReason,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Daily Attendance Sheet & Corrections
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Biometric attendance records calculated against scheduled
              timetable sessions. Manual corrections require an explicit
              justification and are permanently recorded in the audit trail.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <select
              value={centreFilter}
              onChange={(e) => setCentreFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">All Training Centres</option>
              {centres?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">All Training Cohorts</option>
              {cohorts?.map((coh) => (
                <option key={coh._id} value={coh._id}>
                  {coh.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">All Attendance Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late (Arrived after grace period)</option>
              <option value="Absent">Absent</option>
              <option value="Excused">Excused</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Enrolled Trainee</TableHead>
                <TableHead>Cohort & Skill Track</TableHead>
                <TableHead>First Clock-In</TableHead>
                <TableHead>Last Clock-Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Calculated Status</TableHead>
                <TableHead>Manual Correction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceSheet && attendanceSheet.length > 0 ? (
                attendanceSheet.map((rec) => (
                  <TableRow key={rec._id}>
                    <TableCell className="text-xs font-semibold">
                      {formatDate(rec.date)}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {rec.beneficiaryId?.firstName}{" "}
                        {rec.beneficiaryId?.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {rec.beneficiaryId?.beneficiaryCode}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {rec.skillAreaId?.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {rec.cohortId?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {rec.firstClockIn ? (
                        formatDate(rec.firstClockIn, true).split(",")[1]
                      ) : (
                        <span className="text-slate-400 italic">No scan</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {rec.lastClockOut ? (
                        formatDate(rec.lastClockOut, true).split(",")[1]
                      ) : (
                        <span className="text-slate-400 italic">No scan</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rec.durationMinutes
                        ? `${rec.durationMinutes} mins`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rec.status} size="sm" />
                      {rec.isManualCorrection && (
                        <span className="block text-[10px] text-amber-600 font-semibold mt-0.5">
                          * Manual Override
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenCorrection(rec)}
                        className="text-xs font-semibold h-7 gap-1"
                      >
                        <Edit3 className="h-3 w-3" /> Correct
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No attendance records found matching filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Audited Manual Correction Dialog */}
        <Dialog
          open={isCorrectionModalOpen}
          onOpenChange={setIsCorrectionModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary dark:text-primary">
                <ShieldAlert className="h-6 w-6" />
                <DialogTitle>Manual Attendance Correction & Audit</DialogTitle>
              </div>
              <DialogDescription>
                Correct attendance for{" "}
                <strong>
                  {selectedRecord?.beneficiaryId?.firstName}{" "}
                  {selectedRecord?.beneficiaryId?.lastName}
                </strong>{" "}
                on {formatDate(selectedRecord?.date)}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1 dark:bg-slate-900 dark:border-slate-800">
                <p>
                  <strong>Current Status:</strong> {selectedRecord?.status}
                </p>
                <p>
                  <strong>Clock In Recorded:</strong>{" "}
                  {selectedRecord?.firstClockIn
                    ? formatDate(selectedRecord.firstClockIn, true)
                    : "None"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  New Attendance Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="Present">Present (Mark On-Time)</option>
                  <option value="Late">Late</option>
                  <option value="Excused">
                    Excused (Medical/Official Reason)
                  </option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mandatory Audit Justification / Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Scanner optical reader glitch verified by Centre Manager; trainee was physically present in Solar workshop."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCorrectionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCorrection}
                disabled={!correctionReason.trim() || correctMutation.isPending}
              >
                {correctMutation.isPending
                  ? "Saving..."
                  : "Apply Correction & Audit Log"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
