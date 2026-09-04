"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Award, Plus, CheckCircle2, FileText, UserCheck } from "lucide-react";
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
import { Assessment, Cohort, Enrollment } from "@/interfaces";

export default function AssessmentsGradebookPage() {
  const queryClient = useQueryClient();
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeScores, setGradeScores] = useState<Record<string, number>>({});

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["admin-assessments-list"],
    queryFn: async () => {
      const res = await api.get("/assessments");
      return res.data?.data as Assessment[];
    },
  });

  const { data: resultsData } = useQuery({
    queryKey: ["admin-assessment-results"],
    queryFn: async () => {
      const res = await api.get("/assessments/results");
      return res.data?.data;
    },
  });

  const { data: activeTrainees } = useQuery({
    queryKey: ["admin-trainees-for-grading"],
    queryFn: async () => {
      const res = await api.get("/enrollments/queue?status=Active");
      return res.data?.data as Enrollment[];
    },
    enabled: isGradeModalOpen,
  });

  const enterGradesMutation = useMutation({
    mutationFn: async ({
      assessmentId,
      results,
    }: {
      assessmentId: string;
      results: any[];
    }) => {
      const res = await api.post("/assessments/results/batch", {
        assessmentId,
        results,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsGradeModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-assessment-results"] });
    },
  });

  const handleOpenGradeModal = (ass: Assessment) => {
    setSelectedAssessment(ass);
    setGradeScores({});
    setIsGradeModalOpen(true);
  };

  const handleConfirmGrades = () => {
    if (!selectedAssessment || !activeTrainees) return;
    const batch = activeTrainees.map((t) => ({
      beneficiaryId: t.beneficiaryId?._id || t.beneficiaryId,
      enrollmentId: t._id,
      score: gradeScores[t._id] || 80,
      remarks: "Competency verified during practical evaluation.",
    }));

    enterGradesMutation.mutate({
      assessmentId: selectedAssessment._id,
      results: batch,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Assessments & Gradebook
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Record practical and theory competency evaluations. Training
              completion and assessment passing are evaluated independently.
            </p>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
            Active Practical & Theory Assessments
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment Title & Type</TableHead>
                  <TableHead>Cohort & Skill Track</TableHead>
                  <TableHead>Max Score / Pass Threshold</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments && assessments.length > 0 ? (
                  assessments.map((ass) => (
                    <TableRow key={ass._id}>
                      <TableCell>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                          {ass.title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ass.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-semibold text-teal-800 dark:text-teal-300 block">
                          {ass.skillAreaId?.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ass.cohortId?.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        Max: <strong>{ass.maxScore}</strong> • Pass:{" "}
                        <strong className="text-teal-700">
                          {ass.passingScore}
                        </strong>
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(ass.scheduledDate)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleOpenGradeModal(ass)}
                          className="bg-teal-700 hover:bg-teal-800 text-xs h-7 gap-1"
                        >
                          <Award className="h-3 w-3" /> Enter Grades
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-slate-500 text-xs"
                    >
                      No assessments recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Graded Results Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
            Recorded Gradebook Results
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainee</TableHead>
                  <TableHead>Assessment Title</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultsData && resultsData.length > 0 ? (
                  resultsData.map((res: any) => (
                    <TableRow key={res._id}>
                      <TableCell>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                          {res.beneficiaryId?.firstName}{" "}
                          {res.beneficiaryId?.lastName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {res.beneficiaryId?.beneficiaryCode}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {res.assessmentId?.title}
                      </TableCell>
                      <TableCell className="font-bold text-xs">
                        {res.score}/{res.assessmentId?.maxScore || 100}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {res.percentage}%
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-teal-700">
                        {res.grade}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={res.passed ? "Completed" : "Failed"}
                          size="sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-slate-500 text-xs"
                    >
                      No results graded yet. Select an assessment above to enter
                      grades.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Batch Grade Entry Modal */}
        <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Enter Assessment Grades</DialogTitle>
              <DialogDescription>
                Assessment: <strong>{selectedAssessment?.title}</strong> (Max:{" "}
                {selectedAssessment?.maxScore}, Pass:{" "}
                {selectedAssessment?.passingScore})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs max-h-80 overflow-y-auto">
              {activeTrainees?.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {t.beneficiaryId?.firstName} {t.beneficiaryId?.lastName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {t.enrollmentCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Score:</span>
                    <Input
                      type="number"
                      defaultValue={85}
                      className="w-20 h-8 text-xs font-bold text-center"
                      onChange={(e) =>
                        setGradeScores({
                          ...gradeScores,
                          [t._id]: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsGradeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmGrades}
                disabled={enterGradesMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {enterGradesMutation.isPending
                  ? "Saving..."
                  : "Record & Publish Results"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
