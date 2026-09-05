"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
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
import { Certificate, Enrollment } from "@/interfaces";

export default function CertificatesRegistryPage() {
  const queryClient = useQueryClient();
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [grade, setGrade] = useState("Distinction");
  const [score, setScore] = useState(88);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["admin-certificates-all"],
    queryFn: async () => {
      const res = await api.get("/certificates");
      return res.data?.data as Certificate[];
    },
  });

  const { data: activeTrainees } = useQuery({
    queryKey: ["trainees-for-certificate-issue"],
    queryFn: async () => {
      const res = await api.get("/enrollments/queue?status=Active");
      return res.data?.data as Enrollment[];
    },
  });

  const issueCertMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/certificates/issue", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsIssueModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-certificates-all"] });
    },
  });

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollmentId) return;
    issueCertMutation.mutate({
      enrollmentId: selectedEnrollmentId,
      grade,
      score,
      signatoryName: "Hon. Adele Executive Director",
      signatoryTitle: "Executive Director, AEF",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Certificates & Credentials Registry
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Official issued certificates with cryptographic public
              verification tokens. Each certificate is publicly verifiable by
              employers and government bodies.
            </p>
          </div>
          <Button
            onClick={() => setIsIssueModalOpen(true)}
            className="text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Issue Certificate
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cert Number & Recipient</TableHead>
                <TableHead>Program & Skill Track</TableHead>
                <TableHead>Training Centre</TableHead>
                <TableHead>Attendance / Grade</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Public Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates && certificates.length > 0 ? (
                certificates.map((cert) => (
                  <TableRow key={cert._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {cert.beneficiaryId?.firstName}{" "}
                        {cert.beneficiaryId?.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-primary dark:text-primary font-bold">
                        {cert.certificateNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                        {cert.skillAreaId?.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {cert.programId?.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {cert.centreId?.name}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      <span className="text-primary">
                        {cert.overallAttendanceRate}%
                      </span>{" "}
                      • {cert.grade || "Pass"}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {formatDate(cert.issueDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cert.status} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `/verify/${cert.verificationCode}`,
                            "_blank",
                          )
                        }
                        className="text-xs font-semibold h-7 gap-1 text-primary"
                      >
                        <ExternalLink className="h-3 w-3" /> Verify Public URL
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
                    No certificates issued yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Issue Certificate Modal */}
        <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Issue Verified Certificate</DialogTitle>
              <DialogDescription>
                Generate an official credential with a unique cryptographic
                verification token.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleIssue} className="space-y-3 text-xs py-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Completed Trainee *
                </label>
                <select
                  required
                  value={selectedEnrollmentId}
                  onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">Select Enrolled Trainee</option>
                  {activeTrainees?.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.beneficiaryId?.firstName} {t.beneficiaryId?.lastName} (
                      {t.skillAreaId?.name} • Attendance:{" "}
                      {t.overallAttendanceRate || 94}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="Distinction">Distinction</option>
                    <option value="Credit">Credit</option>
                    <option value="Pass">Pass</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Assessment Score
                  </label>
                  <Input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !selectedEnrollmentId || issueCertMutation.isPending
                  }
                >
                  {issueCertMutation.isPending
                    ? "Generating..."
                    : "Issue & Publish Certificate"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
