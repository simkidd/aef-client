"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Fingerprint,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Search,
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
import { Enrollment, BiometricDevice } from "@/interfaces";

export default function BiometricRegistrationDeskPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);

  // Verification Form State
  const [docsChecked, setDocsChecked] = useState(true);
  const [idVerified, setIdVerified] = useState(true);
  const [physicalNotes, setPhysicalNotes] = useState("");

  // Biometric Registration State
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const { data: queue, isLoading } = useQuery({
    queryKey: ["enrollment-biometric-queue", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      const res = await api.get(`/enrollments/queue?${params.toString()}`);
      return res.data?.data as Enrollment[];
    },
  });

  const { data: devices } = useQuery({
    queryKey: ["biometric-devices-list"],
    queryFn: async () => {
      const res = await api.get("/biometrics/devices");
      return res.data?.data as BiometricDevice[];
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await api.post(`/enrollments/${id}/verify-physical`, payload);
      return res.data;
    },
    onSuccess: () => {
      setIsVerifyModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["enrollment-biometric-queue"],
      });
    },
  });

  const registerBiometricMutation = useMutation({
    mutationFn: async ({ id, deviceId }: { id: string; deviceId?: string }) => {
      const res = await api.post(`/enrollments/${id}/register-biometric`, {
        deviceId,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsBiometricModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["enrollment-biometric-queue"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  const handleOpenVerify = (enr: Enrollment) => {
    setSelectedEnrollment(enr);
    setDocsChecked(true);
    setIdVerified(true);
    setPhysicalNotes("");
    setIsVerifyModalOpen(true);
  };

  const handleOpenBiometric = (enr: Enrollment) => {
    setSelectedEnrollment(enr);
    setSelectedDeviceId(devices?.[0]?._id || "");
    setIsBiometricModalOpen(true);
  };

  const handleConfirmVerify = () => {
    if (!selectedEnrollment) return;
    verifyMutation.mutate({
      id: selectedEnrollment._id,
      payload: {
        documentsChecked: docsChecked,
        identityVerified: idVerified,
        physicalNotes,
      },
    });
  };

  const handleConfirmBiometric = () => {
    if (!selectedEnrollment) return;
    registerBiometricMutation.mutate({
      id: selectedEnrollment._id,
      deviceId: selectedDeviceId || devices?.[0]?._id || undefined,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Physical Verification & Biometric Registration Desk
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Onboard selected candidates. Being selected does not automatically
              enroll a candidate; physical identity checks and biometric
              template capture are strictly required.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">All Onboarding Queue Statuses</option>
              <option value="Selected">
                Selected (Awaiting Centre Arrival)
              </option>
              <option value="Awaiting Biometric">
                Awaiting Biometric Fingerprint Scan
              </option>
              <option value="Verification Issue">
                Verification Issue Flagged
              </option>
              <option value="Active">Active Enrolled Trainees</option>
            </select>
          </div>
        </Card>

        {/* Queue Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment Code & Trainee</TableHead>
                <TableHead>Assigned Centre & Cohort</TableHead>
                <TableHead>Skill Track</TableHead>
                <TableHead>Physical Verification</TableHead>
                <TableHead>Biometric Status</TableHead>
                <TableHead>Lifecycle Status</TableHead>
                <TableHead>Desk Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue && queue.length > 0 ? (
                queue.map((enr) => {
                  const isVerified = enr.verificationDetails?.identityVerified;
                  const hasBiometrics =
                    !!enr.biometricRegistrationDetails?.biometricIdentifier;

                  return (
                    <TableRow key={enr._id}>
                      <TableCell>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                          {enr.beneficiaryId?.firstName}{" "}
                          {enr.beneficiaryId?.lastName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {enr.enrollmentCode || "Pending Code"} •{" "}
                          {enr.beneficiaryId?.phone}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {enr.centreId?.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {enr.cohortId?.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                        {enr.skillAreaId?.name}
                      </TableCell>
                      <TableCell>
                        {isVerified ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                            Pending Physical Check
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasBiometrics ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                            <Fingerprint className="h-3 w-3" /> Registered
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Not Captured
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={enr.status} size="sm" />
                      </TableCell>
                      <TableCell>
                        {!isVerified ? (
                          <Button
                            size="sm"
                            onClick={() => handleOpenVerify(enr)}
                            className="bg-teal-700 hover:bg-teal-800 text-xs h-7 gap-1"
                          >
                            <UserCheck className="h-3 w-3" /> Verify Identity
                          </Button>
                        ) : !hasBiometrics ? (
                          <Button
                            size="sm"
                            onClick={() => handleOpenBiometric(enr)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-xs h-7 gap-1"
                          >
                            <Fingerprint className="h-3 w-3" /> Capture
                            Biometrics
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold">
                            Enrolled Active
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No candidates currently in the verification queue.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Step 1: Physical Verification Modal */}
        <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Physical Identity & Document Verification
              </DialogTitle>
              <DialogDescription>
                Trainee:{" "}
                <strong>
                  {selectedEnrollment?.beneficiaryId?.firstName}{" "}
                  {selectedEnrollment?.beneficiaryId?.lastName}
                </strong>{" "}
                ({selectedEnrollment?.centreId?.name})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-2 rounded-lg bg-slate-50 border border-slate-200 p-3 dark:bg-slate-900 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={docsChecked}
                    onChange={(e) => setDocsChecked(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                  Educational WAEC / SSCE Certificate Checked
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={idVerified}
                    onChange={(e) => setIdVerified(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded"
                  />
                  Government ID / NIN Matched with Candidate
                </label>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Verification Officer Notes
                </label>
                <textarea
                  rows={2}
                  value={physicalNotes}
                  onChange={(e) => setPhysicalNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsVerifyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmVerify}
                disabled={verifyMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {verifyMutation.isPending
                  ? "Verifying..."
                  : "Approve Physical Verification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Step 2: Biometric Fingerprint Registration Modal */}
        <Dialog
          open={isBiometricModalOpen}
          onOpenChange={setIsBiometricModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Fingerprint className="h-6 w-6 text-teal-700" />
                <div>
                  <DialogTitle>
                    Capture Biometric Fingerprint Template
                  </DialogTitle>
                  <DialogDescription>
                    Associate scanner hardware identity token for{" "}
                    <strong>
                      {selectedEnrollment?.beneficiaryId?.firstName}{" "}
                      {selectedEnrollment?.beneficiaryId?.lastName}
                    </strong>
                    .
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Active Desk Scanner *
                </label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
                >
                  {devices?.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.deviceName} ({dev.deviceSerial}) — {dev.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-center space-y-2 dark:bg-teal-950/40 dark:border-teal-900">
                <div className="h-12 w-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto dark:bg-teal-900 dark:text-teal-200 animate-pulse">
                  <Fingerprint className="h-7 w-7" />
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Ready to Capture Biometric Identity
                </p>
                <p className="text-slate-500 text-[11px]">
                  Place index finger on the optical reader glass. A secure
                  128-bit hardware token will be bound to this beneficiary's
                  profile.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBiometricModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBiometric}
                disabled={registerBiometricMutation.isPending}
                className="bg-emerald-700 hover:bg-emerald-800 gap-1.5"
              >
                <Fingerprint className="h-4 w-4" />
                {registerBiometricMutation.isPending
                  ? "Registering..."
                  : "Register & Confirm Active Enrollment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
