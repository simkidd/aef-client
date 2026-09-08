"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Clock, Building, Fingerprint, ShieldCheck, MapPin, Megaphone, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { AnnouncementModal } from "@/components/portal/AnnouncementModal";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate } from "@/lib/utils";
import {
  useMyTrainingJourneyQuery,
  useMyApplicationsQuery,
  useAnnouncementsQuery,
} from "@/hooks";

const SEEN_ANNOUNCEMENTS_KEY = "aef_seen_announcements";

export function BeneficiaryDashboardView() {
  const { user } = useAuthStore();

  const { data: applications } = useMyApplicationsQuery();
  const { data: trainingData } = useMyTrainingJourneyQuery();
  const { data: rawAnnouncements } = useAnnouncementsQuery();

  const announcements = Array.isArray(rawAnnouncements) ? rawAnnouncements : [];

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);

  const handleOpenAnnouncement = (id?: string) => {
    if (id) {
      setSelectedAnnouncementId(id);
    } else {
      setSelectedAnnouncementId(null);
    }
    setIsAnnouncementModalOpen(true);
  };

  const activeEnrollment = trainingData?.active;
  const isEnrolledActive = activeEnrollment?.status === "Active";
  const isSelectedPending =
    activeEnrollment?.status === "Selected" ||
    activeEnrollment?.status === "Awaiting Biometric" ||
    activeEnrollment?.status === "Awaiting Verification";

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="rounded-2xl bg-linear-to-r from-emerald-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/20 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Adele Beneficiary Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {isEnrolledActive
                  ? "You are an active trainee. Check today's practical session and clock-in at the centre."
                  : isSelectedPending
                    ? "Congratulations! You have been selected. Please complete physical verification & biometric scan."
                    : "Discover empowerment programs, apply for technical skills certifications, and track your training journey."}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/portal/programs">
                <Button className="font-semibold">
                  Browse Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* State 1: Active Trainee */}
        {isEnrolledActive && activeEnrollment && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-primary/20 shadow-md dark:border-primary/20">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                    <CardTitle className="text-base text-primary">
                      Ongoing Primary Training Cohort
                    </CardTitle>
                  </div>
                  <StatusBadge status={activeEnrollment.status} />
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {activeEnrollment.skillAreaId?.name || "Technical Training"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Program: {activeEnrollment.programId?.title} • Cohort:{" "}
                    {activeEnrollment.cohortId?.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-primary" /> Training Centre
                    </span>
                    <p className="font-semibold text-slate-900 mt-1 dark:text-slate-100 truncate">
                      {activeEnrollment.centreId?.name}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Fingerprint className="h-3.5 w-3.5 text-primary" /> Biometric Identity
                    </span>
                    <p className="font-semibold text-primary mt-1">Verified & Active</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" /> Daily Schedule
                    </span>
                    <p className="font-semibold text-slate-900 mt-1 dark:text-slate-100">
                      {activeEnrollment.cohortId?.schedule || "See Timetable"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Overall Attendance Progress</span>
                    <span className="text-primary font-bold">
                      {activeEnrollment.overallAttendanceRate ?? "—"}%
                    </span>
                  </div>
                  <Progress value={activeEnrollment.overallAttendanceRate ?? 0} />
                  <p className="text-[11px] text-slate-500">
                    * Minimum 80% attendance required for certificate issuance.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 flex justify-between">
                <Link href="/portal/training">
                  <Button variant="outline" size="sm">View Full Attendance History</Button>
                </Link>
                <Link href="/portal/timetable">
                  <Button size="sm">View Weekly Timetable</Button>
                </Link>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Centre Physical Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {activeEnrollment.centreId?.name}
                      </p>
                      <p className="text-slate-500">{activeEnrollment.centreId?.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary bg-primary/10 p-2.5 rounded-lg border border-primary/20 dark:bg-primary/15">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>Fingerprint Scanner assigned to you at reception</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Megaphone className="h-4 w-4 text-primary" />
                    Announcements
                  </CardTitle>
                  {announcements.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAnnouncementModalOpen(true)}
                      className="text-xs text-primary h-7 px-2 hover:underline"
                    >
                      View All
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements && announcements.length > 0 ? (
                    announcements.slice(0, 2).map((ann: any) => (
                      <div
                        key={ann._id}
                        onClick={() => handleOpenAnnouncement(ann._id)}
                        className="text-xs space-y-1 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/80 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {ann.title}
                          </p>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        </div>
                        <p className="text-slate-500 line-clamp-2">{ann.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No active announcements</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* State 2: Selected Candidate */}
        {isSelectedPending && activeEnrollment && (
          <Card className="border-amber-300 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-amber-900 dark:text-amber-200">
                    Action Required: Physical Verification & Biometric Registration
                  </CardTitle>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    You have been selected for{" "}
                    <strong>{activeEnrollment.skillAreaId?.name}</strong>!
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <p>
                To confirm your enrollment into{" "}
                <strong>{activeEnrollment.cohortId?.name}</strong>, visit your assigned training centre:
              </p>
              <div className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900 dark:bg-slate-900">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {activeEnrollment.centreId?.name}
                </p>
                <p className="text-slate-500 mt-0.5">{activeEnrollment.centreId?.address}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 font-semibold text-slate-600 dark:text-slate-400">
                  <span>• Required: Valid Government ID</span>
                  <span>• 2 Passport Photographs</span>
                  <span>• Educational WAEC/SSCE Certificate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Non-Enrolled Announcements Section */}
        {!isEnrolledActive && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Megaphone className="h-4 w-4 text-primary" />
                Foundation Announcements & Notices
              </CardTitle>
              {announcements.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAnnouncementModalOpen(true)}
                  className="text-xs text-primary h-7 px-2 hover:underline"
                >
                  View All Notices
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements && announcements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {announcements.slice(0, 4).map((ann: any) => (
                    <div
                      key={ann._id}
                      onClick={() => handleOpenAnnouncement(ann._id)}
                      className="text-xs space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 cursor-pointer transition-colors border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {ann.title}
                        </p>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-slate-500 line-clamp-2 mt-1">{ann.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No active announcements</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Applications Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              My Applications History
            </h2>
            <Link href="/portal/applications" className="text-xs font-semibold text-primary hover:underline">
              View All ({applications?.length ?? 0})
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications && applications.length > 0 ? (
              applications.map((app) => (
                <Card key={app._id} className="hover:shadow-sm transition-all">
                  <CardContent className="p-5 flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {app.applicationNumber}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {app.preferredSkillAreaId?.name}
                      </h3>
                      <p className="text-xs text-slate-500">{app.programId?.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Submitted: {formatDate(app.submittedAt)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-xs text-slate-500 col-span-2">No applications submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => {
          setIsAnnouncementModalOpen(false);
          setSelectedAnnouncementId(null);
        }}
        announcements={announcements}
        selectedAnnouncementId={selectedAnnouncementId}
      />
    </>
  );
}
