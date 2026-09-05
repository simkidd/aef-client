"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Calendar,
  MapPin,
  User,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { TrainingSession, Enrollment } from "@/interfaces";

export default function PortalTimetablePage() {
  const { data: trainingData } = useQuery({
    queryKey: ["my-training-journey"],
    queryFn: async () => {
      const res = await api.get("/enrollments/my-training");
      return res.data?.data as { active?: Enrollment; history: Enrollment[] };
    },
  });

  const activeCohortId =
    trainingData?.active?.cohortId?._id || trainingData?.active?.cohortId;

  // Fetch upcoming scheduled sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["portal-sessions", activeCohortId],
    queryFn: async () => {
      const res = await api.get(
        `/cohorts/schedule/sessions?cohortId=${activeCohortId}`,
      );
      return res.data?.data as TrainingSession[];
    },
    enabled: !!activeCohortId,
  });

  // Fetch calendar events / holidays
  const { data: calendarEvents } = useQuery({
    queryKey: ["portal-calendar-events"],
    queryFn: async () => {
      const res = await api.get("/cohorts/calendar/events");
      return res.data?.data;
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Training Timetable & Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven schedule of your practical sessions, instructors,
            workshop rooms, and training calendar exceptions.
          </p>
        </div>

        {/* Timetable Schedule Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
              Scheduled Training Sessions
            </h2>

            {sessionsLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Loading timetable sessions...
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((sess) => (
                  <Card
                    key={sess._id}
                    className="p-4 hover:shadow-xs transition-all border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold dark:bg-primary/15 dark:text-primary shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {sess.topic ||
                                sess.skillAreaId?.name ||
                                "Practical Session"}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {sess.sessionType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatDate(sess.sessionDate)} • {sess.startTime} –{" "}
                            {sess.endTime}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                            <span>
                              Room:{" "}
                              <strong>
                                {sess.roomId?.name || "Main Practical Workshop"}
                              </strong>
                            </span>
                            <span>
                              Trainer:{" "}
                              <strong>
                                {sess.trainerStaffId?.firstName}{" "}
                                {sess.trainerStaffId?.lastName}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {sess.isCancelled ? (
                        <StatusBadge status="Cancelled" size="sm" />
                      ) : (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 dark:bg-primary/15 dark:border-primary/20 dark:text-primary">
                          Scheduled
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-xs text-slate-500">
                No active timetable sessions found for this cohort.
              </Card>
            )}
          </div>

          {/* Calendar Exceptions (Holidays, Centre Closures) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">
              Training Calendar Exceptions
            </h2>
            <Card className="p-4 space-y-3">
              <p className="text-xs text-slate-500">
                Official closures or holidays. Non-training days do not penalize
                your attendance calculation.
              </p>

              {calendarEvents?.map((evt: any) => (
                <div
                  key={evt._id}
                  className="rounded-lg border border-slate-200 p-3 text-xs space-y-1 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {evt.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold dark:bg-amber-950 dark:text-amber-300">
                      {evt.eventType}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {formatDate(evt.startDate)}
                  </p>
                  {evt.description && (
                    <p className="text-slate-600 text-[11px] mt-1">
                      {evt.description}
                    </p>
                  )}
                </div>
              )) || (
                <p className="text-xs text-slate-400">
                  No upcoming calendar exceptions.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
