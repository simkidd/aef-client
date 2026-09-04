"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Compass,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Fingerprint,
  Building,
  User,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/stores/auth.store";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Application, Enrollment, Announcement } from "@/interfaces";

export default function BeneficiaryDashboard() {
  const { user } = useAuthStore();

  // Fetch applications
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await api.get("/applications/my");
      return res.data?.data as Application[];
    },
  });

  // Fetch active training
  const { data: trainingData, isLoading: trainLoading } = useQuery({
    queryKey: ["my-active-training"],
    queryFn: async () => {
      const res = await api.get("/enrollments/my-training");
      return res.data?.data as { active?: Enrollment; history: Enrollment[] };
    },
  });

  // Fetch announcements
  const { data: announcements } = useQuery({
    queryKey: ["announcements-portal"],
    queryFn: async () => {
      const res = await api.get("/announcements");
      return res.data?.data as Announcement[];
    },
  });

  const activeEnrollment = trainingData?.active;
  const isEnrolledActive = activeEnrollment?.status === "Active";
  const isSelectedPending =
    activeEnrollment?.status === "Selected" ||
    activeEnrollment?.status === "Awaiting Biometric" ||
    activeEnrollment?.status === "Awaiting Verification";
  const isCompleted = activeEnrollment?.status === "Completed";

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="rounded-2xl bg-linear-to-r from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Adele Beneficiary Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {isEnrolledActive
                  ? "You are an active trainee. Check today’s practical session and clock-in at the centre."
                  : isSelectedPending
                    ? "Congratulations! You have been selected. Please complete physical verification & biometric scan."
                    : "Discover empowerment programs, apply for technical skills certifications, and track your training journey."}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/portal/programs">
                <Button className="bg-teal-600 hover:bg-teal-500 text-white font-semibold">
                  Browse Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* State 1: Active Trainee Live Training Card */}
        {isEnrolledActive && activeEnrollment && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-teal-200 shadow-md dark:border-teal-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <CardTitle className="text-base text-teal-900 dark:text-teal-200">
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

                {/* Training Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-teal-600" />{" "}
                      Training Centre
                    </span>
                    <p className="font-semibold text-slate-900 mt-1 dark:text-slate-100 truncate">
                      {activeEnrollment.centreId?.name}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Fingerprint className="h-3.5 w-3.5 text-teal-600" />{" "}
                      Biometric Identity
                    </span>
                    <p className="font-semibold text-emerald-700 mt-1">
                      Verified & Active
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-teal-600" /> Daily
                      Schedule
                    </span>
                    <p className="font-semibold text-slate-900 mt-1 dark:text-slate-100">
                      Mon, Wed, Fri (09:00 - 12:00)
                    </p>
                  </div>
                </div>

                {/* Attendance Gauge */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Overall Attendance Progress
                    </span>
                    <span className="text-teal-700 font-bold dark:text-teal-400">
                      {activeEnrollment.overallAttendanceRate || 94.2}%
                    </span>
                  </div>
                  <Progress
                    value={activeEnrollment.overallAttendanceRate || 94}
                  />
                  <p className="text-[11px] text-slate-500">
                    * Minimum 80% attendance required for certificate issuance.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 flex justify-between">
                <Link href="/portal/training">
                  <Button variant="outline" size="sm">
                    View Full Attendance History
                  </Button>
                </Link>
                <Link href="/portal/timetable">
                  <Button size="sm" className="bg-teal-700 hover:bg-teal-800">
                    View Weekly Timetable
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Quick Actions & Centre Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Centre Physical Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {activeEnrollment.centreId?.name}
                      </p>
                      <p className="text-slate-500">
                        {activeEnrollment.centreId?.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>
                      Fingerprint Scanner assigned to you at reception
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Announcements Widget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Foundation Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements?.slice(0, 2).map((ann) => (
                    <div
                      key={ann._id}
                      className="text-xs space-y-1 border-b pb-2 last:border-0 last:pb-0 border-slate-100 dark:border-slate-800"
                    >
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {ann.title}
                      </p>
                      <p className="text-slate-500 line-clamp-2">
                        {ann.content}
                      </p>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-500">
                      No active announcements
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* State 2: Selected Candidate (Pending Biometric Registration & Physical Verification) */}
        {isSelectedPending && activeEnrollment && (
          <Card className="border-amber-300 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-amber-900 dark:text-amber-200">
                    Action Required: Physical Verification & Biometric
                    Registration
                  </CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-300">
                    You have been selected for{" "}
                    <strong>{activeEnrollment.skillAreaId?.name}</strong>!
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <p>
                To confirm your enrollment into{" "}
                <strong>{activeEnrollment.cohortId?.name}</strong>, you are
                required to physically visit your assigned training centre:
              </p>
              <div className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900 dark:bg-slate-900">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {activeEnrollment.centreId?.name}
                </p>
                <p className="text-slate-500 mt-0.5">
                  {activeEnrollment.centreId?.address}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 font-semibold text-slate-600 dark:text-slate-400">
                  <span>• Required: Valid Government ID</span>
                  <span>• 2 Passport Photographs</span>
                  <span>• Educational WAEC/SSCE Certificate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Applications Quick Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              My Applications History
            </h2>
            <Link
              href="/portal/applications"
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              View All ({applications?.length || 0})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications?.map((app) => (
              <Card key={app._id} className="hover:shadow-sm transition-all">
                <CardContent className="p-5 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {app.applicationNumber}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {app.preferredSkillAreaId?.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {app.programId?.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Submitted: {formatDate(app.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </CardContent>
              </Card>
            )) || (
              <p className="text-xs text-slate-500 col-span-2">
                No applications submitted yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
