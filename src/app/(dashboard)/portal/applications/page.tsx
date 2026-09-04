"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Calendar,
  MapPin,
  Building,
  Fingerprint,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Application } from "@/interfaces";

export default function MyApplicationsPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await api.get("/applications/my");
      return res.data?.data as Application[];
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              My Applications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track the full lifecycle of your applications from submission to
              selection and biometric registration.
            </p>
          </div>
          <Link href="/portal/programs">
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800">
              Apply to More Programs
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wider">
              Loading applications...
            </p>
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app._id}
                className="overflow-hidden border-slate-200 dark:border-slate-800"
              >
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 dark:bg-slate-900/50 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                        {app.applicationNumber}
                      </span>
                      <CardTitle className="text-base text-slate-900 mt-0.5 dark:text-slate-100">
                        {app.preferredSkillAreaId?.name || "Technical Track"}
                      </CardTitle>
                      <p className="text-xs text-slate-500">
                        {app.programId?.title}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4 text-xs">
                  {/* Instructions for Selected Candidates */}
                  {app.status === "Selected" && (
                    <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-teal-900 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-200">
                      <div className="flex items-start gap-3">
                        <Fingerprint className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm">
                            Next Step: Physical Verification & Biometric Scan
                          </p>
                          <p className="mt-1 text-slate-600 dark:text-slate-300">
                            Please report to{" "}
                            <strong>
                              {app.preferredCentreId?.name ||
                                "your assigned centre"}
                            </strong>{" "}
                            ({app.preferredCentreId?.address}) with your
                            original Government ID and educational certificates
                            to register your biometric fingerprint profile.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Submitted On
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {formatDate(app.submittedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Preferred Centre
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {app.preferredCentreId?.name || "Main Hub"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Organizer
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {app.programId?.organizerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Application Outcome
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Status History Timeline */}
                  {app.statusHistory && app.statusHistory.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Status Progression Timeline
                      </p>
                      <div className="space-y-2">
                        {app.statusHistory.map((hist, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 text-[11px]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {hist.status}
                            </span>
                            <span className="text-slate-400">
                              • {formatDate(hist.changedAt, true)}
                            </span>
                            {hist.reason && (
                              <span className="text-slate-500 italic">
                                ({hist.reason})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Applications Found"
            description="You have not submitted any program applications yet. Explore available opportunities to get started."
            actionLabel="Browse Available Programs"
            onAction={() => (window.location.href = "/portal/programs")}
          />
        )}
      </div>
    </>
  );
}
