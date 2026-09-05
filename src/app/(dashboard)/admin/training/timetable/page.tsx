"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Calendar, MapPin, User, AlertTriangle } from "lucide-react";
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
import { StatusBadge } from "@/components/common/StatusBadge";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { TrainingSession } from "@/interfaces";

export default function TimetableManagementPage() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["admin-all-sessions"],
    queryFn: async () => {
      const res = await api.get("/cohorts/schedule/sessions");
      return res.data?.data as TrainingSession[];
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Training Timetables & Sessions Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven training schedules generated dynamically from cohort
            skill configs. Expected sessions serve as the baseline for the
            biometric attendance engine.
          </p>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Cohort & Skill Area</TableHead>
                <TableHead>Training Centre & Room</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Session Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions && sessions.length > 0 ? (
                sessions.map((sess) => (
                  <TableRow key={sess._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {formatDate(sess.sessionDate)}
                      </span>
                      <span className="font-mono text-[11px] text-primary dark:text-primary font-semibold">
                        {sess.startTime} – {sess.endTime}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                        {sess.skillAreaId?.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {sess.cohortId?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="text-slate-800 dark:text-slate-200 block">
                        {sess.centreId?.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {sess.roomId?.name || "Practical Workshop"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {sess.trainerStaffId
                        ? `${sess.trainerStaffId.firstName} ${sess.trainerStaffId.lastName}`
                        : "Lead Instructor"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {sess.sessionType}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={sess.isCancelled ? "Cancelled" : "Scheduled"}
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
                    No scheduled sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
