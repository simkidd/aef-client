"use client";

import React from "react";
import { Clock, Layers, BellRing } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import {
  useMyTrainingJourneyQuery,
  usePortalSessionsQuery,
  useCalendarEventsQuery,
} from "@/hooks";

export function PortalTimetableView() {
  const { data: trainingData, isLoading: trainingLoading } = useMyTrainingJourneyQuery();

  const activeEnrollment = trainingData?.active;
  const activeCohort = activeEnrollment?.cohortId as any;
  const activeCohortId = activeCohort?._id || activeCohort;
  const activeSkillId =
    (activeEnrollment?.skillAreaId as any)?._id || activeEnrollment?.skillAreaId;
  const isTimetablePublished = activeCohort?.timetableStatus === "published";

  const { data: sessions, isLoading: sessionsLoading } = usePortalSessionsQuery({
    cohortId: activeCohortId,
    publishedOnly: true,
  });

  const { data: calendarEvents } = useCalendarEventsQuery();

  const mySessions = React.useMemo(() => {
    if (!sessions) return [];
    if (!activeSkillId) return sessions;
    return sessions.filter((s: any) => {
      const sessSkillId = s.skillAreaId?._id || s.skillAreaId;
      return sessSkillId === activeSkillId || !sessSkillId;
    });
  }, [sessions, activeSkillId]);

  const activeSlot = mySessions[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Training Timetable & Class Schedule
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Official schedule of your classroom training slots, assigned workshops,
          instructors, and calendar exceptions.
        </p>
      </div>

      {trainingLoading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          Loading your training enrollment…
        </div>
      ) : !activeEnrollment ? (
        <Card className="p-8 text-center space-y-2 border-dashed">
          <Layers className="h-8 w-8 text-muted-foreground/50 mx-auto" />
          <h3 className="text-sm font-bold text-foreground">No Active Enrollment</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You do not currently have an active training enrollment. Apply for an upcoming
            skill program to view your class schedule.
          </p>
        </Card>
      ) : !isTimetablePublished && mySessions.length === 0 ? (
        <Card className="p-8 text-center space-y-4 border-amber-200 bg-amber-50/40 dark:border-amber-800/40 dark:bg-amber-950/20">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Timetable Finalization in Progress
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              The administration is currently drafting the session slots and class times for{" "}
              <strong>{activeCohort?.name || "your cohort"}</strong>.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold dark:bg-amber-950 dark:text-amber-300">
            <BellRing className="h-3.5 w-3.5" />
            Check back soon — you will receive a notification once published!
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Active Class Slot Highlight */}
            {activeSlot && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">
                    {activeSlot.slotNumber ? `S${activeSlot.slotNumber}` : "★"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {activeSlot.slotNumber
                          ? `Session Slot ${activeSlot.slotNumber}`
                          : "Assigned Training Slot"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold border border-emerald-500/20">
                        Official Published Schedule
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      {activeSlot.startTime} – {activeSlot.endTime} Daily
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Track:{" "}
                      <strong>{activeEnrollment.skillAreaId?.name || "Skill Track"}</strong> • Room:{" "}
                      <strong>{activeSlot.roomId?.name || "Main Practical Workshop"}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Upcoming Training Sessions ({mySessions.length})
            </h2>

            {sessionsLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Loading timetable sessions…
              </div>
            ) : mySessions.length > 0 ? (
              <div className="space-y-3">
                {mySessions.map((sess: any) => (
                  <Card key={sess._id} className="p-4 hover:shadow-sm transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {sess.topic || sess.skillAreaId?.name || "Practical Session"}
                            </span>
                            {sess.slotNumber && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono font-semibold text-muted-foreground">
                                Slot {sess.slotNumber}
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium text-muted-foreground">
                              {sess.sessionType || "Practical"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(sess.sessionDate)} •{" "}
                            <strong className="text-foreground font-mono">
                              {sess.startTime} – {sess.endTime}
                            </strong>
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                            <span>
                              Room:{" "}
                              <strong className="text-foreground">
                                {sess.roomId?.name || "Main Practical Workshop"}
                              </strong>
                            </span>
                            <span>
                              Trainer:{" "}
                              <strong className="text-foreground">
                                {sess.trainerStaffId
                                  ? `${sess.trainerStaffId.firstName} ${sess.trainerStaffId.lastName}`
                                  : "Lead Facilitator"}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {sess.isCancelled ? (
                        <StatusBadge status="Cancelled" size="sm" />
                      ) : (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                          Scheduled
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-xs text-muted-foreground">
                No active timetable sessions found for your track.
              </Card>
            )}
          </div>

          {/* Calendar Exceptions */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Training Calendar Exceptions
            </h2>
            <Card className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Official closures or holidays. Non-training days do not penalize your
                attendance calculation.
              </p>

              {calendarEvents && calendarEvents.length > 0 ? (
                calendarEvents.map((evt: any) => (
                  <div
                    key={evt._id}
                    className="rounded-lg border border-border p-3 text-xs space-y-1 bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{evt.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold">
                        {evt.eventType}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {formatDate(evt.startDate)}
                    </p>
                    {evt.description && (
                      <p className="text-muted-foreground text-[11px] mt-1">
                        {evt.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No upcoming calendar exceptions.
                </p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
