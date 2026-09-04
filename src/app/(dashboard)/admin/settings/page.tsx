"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Clock, ShieldCheck, CheckCircle2, Save } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch Attendance Policies
  const { data: policiesData } = useQuery({
    queryKey: ["admin-attendance-policies"],
    queryFn: async () => {
      const res = await api.get("/attendance/policies");
      return res.data?.data?.[0];
    },
  });

  const [policyForm, setPolicyForm] = useState({
    gracePeriodMinutes: 15,
    lateThresholdMinutes: 45,
    minDailyDurationMinutes: 120,
    minAttendancePercentForCertificate: 80,
    lowAttendanceAlertThreshold: 75,
    criticalAttendanceAlertThreshold: 60,
  });

  React.useEffect(() => {
    if (policiesData) {
      setPolicyForm({
        gracePeriodMinutes: policiesData.gracePeriodMinutes || 15,
        lateThresholdMinutes: policiesData.lateThresholdMinutes || 45,
        minDailyDurationMinutes: policiesData.minDailyDurationMinutes || 120,
        minAttendancePercentForCertificate:
          policiesData.minAttendancePercentForCertificate || 80,
        lowAttendanceAlertThreshold:
          policiesData.lowAttendanceAlertThreshold || 75,
        criticalAttendanceAlertThreshold:
          policiesData.criticalAttendanceAlertThreshold || 60,
      });
    }
  }, [policiesData]);

  const savePolicyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const policyId = policiesData?._id || "default";
      const res = await api.put(`/attendance/policies/${policyId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      setSuccessMsg("Attendance configuration saved successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      queryClient.invalidateQueries({
        queryKey: ["admin-attendance-policies"],
      });
    },
  });

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    savePolicyMutation.mutate(policyForm);
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System & Attendance Operational Policies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure operational rules from the dashboard without modifying
            code. Settings govern biometric clock-ins, grace periods, lateness
            thresholds, and certification criteria.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSavePolicy}>
          <Card>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-700" />
                <CardTitle className="text-base">
                  Biometric Attendance Engine Rules
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Fine-tune grace windows and minimum training duration per
                session.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Grace Period (Minutes) *
                  </label>
                  <Input
                    type="number"
                    value={policyForm.gracePeriodMinutes}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        gracePeriodMinutes: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <p className="text-[11px] text-slate-500">
                    Arrival within this window (e.g. 15 mins after session
                    start) is marked On-Time.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Late Threshold (Minutes) *
                  </label>
                  <Input
                    type="number"
                    value={policyForm.lateThresholdMinutes}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        lateThresholdMinutes: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <p className="text-[11px] text-slate-500">
                    Arrival beyond grace period but before threshold is flagged
                    as Late without absence penalty.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Minimum Daily Duration (Minutes) *
                  </label>
                  <Input
                    type="number"
                    value={policyForm.minDailyDurationMinutes}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        minDailyDurationMinutes: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <p className="text-[11px] text-slate-500">
                    Minimum duration between clock-in and clock-out to count as
                    full session attendance.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Certification Attendance Requirement (%) *
                  </label>
                  <Input
                    type="number"
                    value={policyForm.minAttendancePercentForCertificate}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        minAttendancePercentForCertificate: parseInt(
                          e.target.value,
                          10,
                        ),
                      })
                    }
                  />
                  <p className="text-[11px] text-slate-500">
                    Default minimum threshold (e.g. 80%) required to issue
                    completion certificate.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/60 border-t border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={savePolicyMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800 gap-2"
              >
                <Save className="h-4 w-4" />
                {savePolicyMutation.isPending
                  ? "Saving Policies..."
                  : "Save Attendance Policies"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
